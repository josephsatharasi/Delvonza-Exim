import { jsPDF } from 'jspdf';

/** Standard PDF fonts (Helvetica) are WinAnsi — avoid ₹ and other non-Latin-1 chars or text breaks into garbage. */
const formatMoney = (n) => `Rs. ${Number(n || 0).toLocaleString('en-IN')}`;

/**
 * Draw wrapped text one line at a time (avoids jsPDF array overload quirks in v4).
 */
const addWrappedLines = (doc, text, x, y, maxWidth, lineHeight) => {
  const raw = String(text || '').normalize('NFKC');
  const split = doc.splitTextToSize(raw, maxWidth);
  const lines = Array.isArray(split) ? split : String(split).split('\n');
  let cy = y;
  lines.forEach((line) => {
    doc.text(String(line), x, cy);
    cy += lineHeight;
  });
  return cy;
};

export function downloadAdminProfilePdf({ email, organization = 'Delvonza Exim' }) {
  const doc = new jsPDF();
  let y = 16;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Admin profile', 14, y);
  y += 10;
  doc.setFontSize(11);
  y = addWrappedLines(doc, `Organization: ${organization}`, 14, y, 180, 6);
  y += 2;
  y = addWrappedLines(doc, `Administrator email: ${email}`, 14, y, 180, 6);
  y += 2;
  y = addWrappedLines(doc, `Exported: ${new Date().toLocaleString()}`, 14, y, 180, 6);
  doc.save(`delvonza-admin-profile-${Date.now()}.pdf`);
}

export function downloadProductsPdf(products) {
  const doc = new jsPDF();
  let y = 16;
  doc.setFontSize(15);
  doc.setFont('helvetica', 'normal');
  doc.text('Delvonza Exim - All products', 14, y);
  y += 8;
  doc.setFontSize(10);
  y = addWrappedLines(
    doc,
    `Generated: ${new Date().toLocaleString()} | Count: ${products.length}`,
    14,
    y,
    180,
    5
  );
  y += 6;

  products.forEach((p, i) => {
    if (y > 270) {
      doc.addPage();
      y = 16;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${i + 1}. ${p.name || '-'}`, 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    y = addWrappedLines(doc, `Slug: ${p.slug || '-'}`, 16, y, 178, 5);
    y = addWrappedLines(
      doc,
      `Price: ${formatMoney(p.price)}/kg | Hide on site: ${p.hidePrice ? 'Yes' : 'No'}`,
      16,
      y,
      178,
      5
    );
    y = addWrappedLines(doc, `Origin: ${p.origin || '-'}`, 16, y, 178, 5);
    y = addWrappedLines(doc, `Packaging: ${p.packaging || '-'}`, 16, y, 178, 5);
    const desc = (p.shortDescription || p.description || '').slice(0, 200);
    if (desc) y = addWrappedLines(doc, desc, 16, y, 178, 5);
    y += 4;
  });

  doc.save(`delvonza-products-${Date.now()}.pdf`);
}

const lineItemHidesPrice = (item) =>
  item?.product && typeof item.product === 'object' && item.product.hidePrice === true;

export function downloadOrdersPdf(orders) {
  const doc = new jsPDF();
  let y = 16;
  doc.setFontSize(15);
  doc.setFont('helvetica', 'normal');
  doc.text('Delvonza Exim - All orders', 14, y);
  y += 8;
  doc.setFontSize(10);
  y = addWrappedLines(
    doc,
    `Generated: ${new Date().toLocaleString()} | Count: ${orders.length}`,
    14,
    y,
    180,
    5
  );
  y += 6;

  orders.forEach((order, idx) => {
    if (y > 250) {
      doc.addPage();
      y = 16;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`Order ${idx + 1} - ${order._id}`, 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    y = addWrappedLines(
      doc,
      `Customer: ${order.user?.name || '-'} | ${order.user?.email || '-'}`,
      14,
      y,
      180,
      5
    );
    y = addWrappedLines(
      doc,
      `Status: ${order.status || '-'} | ${new Date(order.createdAt).toLocaleString()}`,
      14,
      y,
      180,
      5
    );
    y = addWrappedLines(doc, `Total: ${formatMoney(order.total)}`, 14, y, 180, 5);
    y += 2;
    (order.items || []).forEach((item) => {
      const hide = lineItemHidesPrice(item);
      const pricePart = hide
        ? 'price hidden on storefront'
        : `${formatMoney(item.price)} x ${item.quantity} = ${formatMoney(item.subtotal)}`;
      y = addWrappedLines(doc, `- ${item.name || 'Item'}: ${pricePart}`, 18, y, 175, 5);
      if (y > 275) {
        doc.addPage();
        y = 16;
      }
    });
    y += 6;
  });

  doc.save(`delvonza-orders-${Date.now()}.pdf`);
}
