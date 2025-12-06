import { Currency } from "../types";

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  PKR: 278.50, // Updated market rate
  EUR: 0.92,
  GBP: 0.79
};

export const formatCurrency = (amountInUSD: number, currency: Currency): string => {
  const rate = EXCHANGE_RATES[currency];
  let convertedAmount = amountInUSD * rate;

  // Rounding logic for realism
  if (currency === 'PKR') {
    // For PKR, round to nearest 100 or 500 for cleaner estimates
    convertedAmount = Math.ceil(convertedAmount / 100) * 100;
  } else {
    // For others, round to nearest integer
    convertedAmount = Math.round(convertedAmount);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedAmount);
};

export const convertCost = (amountInUSD: number, currency: Currency): number => {
  const val = amountInUSD * EXCHANGE_RATES[currency];
  if (currency === 'PKR') {
    return Math.ceil(val / 100) * 100;
  }
  return Math.round(val);
};