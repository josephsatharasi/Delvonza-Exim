const net = require('net');
const dns = require('dns').promises;
const nodemailer = require('nodemailer');

const getMailConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const passRaw = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;
  if (!host || !port || !user || !passRaw || !from) {
    return null;
  }
  const portNum = Number(String(port).trim());
  if (!Number.isFinite(portNum) || portNum <= 0) {
    return null;
  }
  // Gmail app passwords are 16 chars; spaces in .env are ignored for auth.
  const pass = String(passRaw).replace(/\s/g, '');
  return {
    host: String(host).trim(),
    port: portNum,
    user: String(user).trim(),
    pass,
    from: String(from).trim()
  };
};

const isMailConfigured = () => Boolean(getMailConfig());

/**
 * Nodemailer mixes A + AAAA and picks randomly; IPv6 to Gmail often hangs on cloud hosts.
 * Prefer dns.resolve4, then lookup IPv4 only; connect by IP with SNI = hostname.
 */
const resolveSmtpConnectTarget = async (hostname) => {
  if (net.isIP(hostname)) {
    return { connectHost: hostname, tlsName: hostname, ipv4: net.isIPv4(hostname) };
  }
  const forceIpv4 = String(process.env.SMTP_FORCE_IPV4 || 'true').toLowerCase() !== 'false';
  if (!forceIpv4) {
    return { connectHost: hostname, tlsName: hostname, ipv4: false };
  }
  try {
    const records = await dns.resolve4(hostname);
    if (records && records.length > 0) {
      return { connectHost: records[0], tlsName: hostname, ipv4: true };
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[adminMail] resolve4 failed', hostname, e && e.message);
  }
  try {
    const { address } = await dns.lookup(hostname, { family: 4 });
    return { connectHost: address, tlsName: hostname, ipv4: true };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[adminMail] IPv4 lookup failed', hostname, e && e.message);
    return { connectHost: hostname, tlsName: hostname, ipv4: false };
  }
};

const buildTransportOptions = (cfg, connectHost, tlsName, port, secure, requireTls587) => {
  const opts = {
    host: connectHost,
    port,
    secure,
    servername: tlsName,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 18_000,
    greetingTimeout: 18_000,
    socketTimeout: 25_000,
    tls: {
      minVersion: 'TLSv1.2',
      servername: tlsName
    }
  };
  if (!secure && port === 587 && requireTls587) {
    opts.requireTLS = true;
  }
  return opts;
};

const createTransport = (cfg, connectHost, tlsName, port, secure, requireTls587) =>
  nodemailer.createTransport(buildTransportOptions(cfg, connectHost, tlsName, port, secure, requireTls587));

const shouldRetryAlternateSmtp = (err) => {
  const c = err && err.code;
  if (c === 'EAUTH' || c === 'EENVELOPE') return false;
  return ['ETIMEDOUT', 'ESOCKET', 'ECONNRESET', 'ECONNREFUSED', 'ETLS', 'EDNS', 'ENOTFOUND'].includes(c);
};

/**
 * Send 4-digit OTP to the admin's registered email (password reset).
 */
const sendAdminPasswordResetEmail = async (toEmail, otp) => {
  if (!isMailConfigured()) {
    const err = new Error('MAIL_NOT_CONFIGURED');
    err.code = 'MAIL_NOT_CONFIGURED';
    throw err;
  }
  const cfg = getMailConfig();
  const { connectHost, tlsName, ipv4 } = await resolveSmtpConnectTarget(cfg.host);
  if (!ipv4) {
    // eslint-disable-next-line no-console
    console.warn('[adminMail] SMTP not resolved to IPv4; nodemailer may pick IPv6 and hang.', cfg.host);
  }

  const subject = 'Delvonza Exim Admin — Password reset code';
  const text = `Your Delvonza Exim admin password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`;
  const html = `<p>Your Delvonza Exim admin password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p><p>If you did not request a reset, you can ignore this email.</p>`;
  const mailPayload = { from: cfg.from, to: toEmail, subject, text, html };

  const envSecure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true';
  const primaryPort = cfg.port;
  const primarySecure = primaryPort === 465 || envSecure;
  const wantRequireTls =
    String(process.env.SMTP_REQUIRE_TLS || 'true').toLowerCase() !== 'false';

  /** @type {{ port: number, secure: boolean, requireTls587: boolean }[]} */
  const steps = [];
  steps.push({ port: primaryPort, secure: primarySecure, requireTls587: wantRequireTls && !primarySecure });

  // 587 STARTTLS often times out on some clouds; try implicit TLS on 465 next.
  if (primaryPort === 587 && !primarySecure) {
    steps.push({ port: 465, secure: true, requireTls587: false });
  }

  let lastErr;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const transporter = createTransport(cfg, connectHost, tlsName, step.port, step.secure, step.requireTls587);
    try {
      // eslint-disable-next-line no-await-in-loop
      await transporter.sendMail(mailPayload);
      transporter.close();
      return;
    } catch (e) {
      lastErr = e;
      try {
        transporter.close();
      } catch (_) {
        /* ignore */
      }
      const retry = i < steps.length - 1 && shouldRetryAlternateSmtp(e);
      // eslint-disable-next-line no-console
      console.error('[adminMail] send attempt failed', { port: step.port, secure: step.secure, code: e.code, message: e.message });
      if (!retry) {
        throw e;
      }
    }
  }
  throw lastErr;
};

module.exports = { sendAdminPasswordResetEmail, isMailConfigured };
