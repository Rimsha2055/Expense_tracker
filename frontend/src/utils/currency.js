export function formatCurrency(value, locale = 'en-PK', currency = 'PKR') {
  const num = Number(value) || 0;
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(num);
  } catch (err) {
    return `${currency} ${num.toFixed(2)}`;
  }
}
