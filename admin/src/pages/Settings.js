import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Save, Share2 } from 'lucide-react';
import { adminApi } from '../api/client';

const SOCIAL_KEYS = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'whatsapp', label: 'WhatsApp' }
];

const defaultVis = () =>
  SOCIAL_KEYS.reduce((acc, { key }) => {
    acc[key] = true;
    return acc;
  }, {});

const Settings = () => {
  const [socialVisibility, setSocialVisibility] = useState(defaultVis);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { socialVisibility: v } = await adminApi.getSiteSettings();
        if (cancelled || !v) return;
        setSocialVisibility((prev) => ({ ...prev, ...v }));
      } catch {
        if (!cancelled) setMessage('Could not load site settings (using defaults).');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (key) => {
    setSocialVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSocial = async () => {
    setSaving(true);
    setMessage('');
    try {
      await adminApi.updateSiteSettings(socialVisibility);
      setMessage('Footer social links updated. Public site will show only enabled networks.');
    } catch (e) {
      setMessage(e.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
      {message && <p className="mb-4 text-sm text-primary-800 bg-primary-50 px-4 py-2 rounded-lg">{message}</p>}

      <div className="grid gap-6 max-w-2xl">
        <Card
          title="Footer — Social media"
          subtitle="Show or hide each link in the website footer (public storefront)."
        >
          {loading ? (
            <p className="text-sm text-gray-600">Loading…</p>
          ) : (
            <ul className="space-y-3 mb-6">
              {SOCIAL_KEYS.map(({ key, label }) => (
                <li key={key} className="flex items-center justify-between gap-4 py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-800">{label}</span>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={Boolean(socialVisibility[key])}
                      onChange={() => toggle(key)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    {socialVisibility[key] ? 'Visible' : 'Hidden'}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <Button icon={Save} onClick={saveSocial} disabled={loading || saving}>
            {saving ? 'Saving…' : 'Save social visibility'}
          </Button>
          <p className="mt-4 text-xs text-gray-500 flex items-start gap-2">
            <Share2 size={14} className="shrink-0 mt-0.5" aria-hidden />
            URLs stay as configured in the site code; this only toggles visibility per network.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
