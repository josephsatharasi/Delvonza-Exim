/** Strip internal stock line from packaging text (admin stores e.g. "Available stock: 1000 kg"). */
export const formatPackagingForDisplay = (packaging) => {
  if (!packaging || typeof packaging !== 'string') return '';
  return packaging
    .replace(/\s*Available\s+stock:\s*[\d.,]+\s*kg\.?\s*/gi, '')
    .replace(/\s*[,;]\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
