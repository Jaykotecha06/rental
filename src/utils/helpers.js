export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

export const calculateLightBill = (currentUnit, lastUnit) => {
  const units = parseFloat(currentUnit) - parseFloat(lastUnit);
  return units > 0 ? units * 9.5 : 0;
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};