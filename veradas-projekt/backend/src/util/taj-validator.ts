export function isValidTaj(taj: string): boolean {
  if (!/^\d{9}$/.test(taj)) return false;

  const digits = taj.split('').map(Number);

  let sum = 0;

  for (let i = 0; i < 8; i++) {
    if (i % 2 === 0) {
      sum += digits[i] * 3;
    } else {
      sum += digits[i] * 7;
    }
  }

  const checkDigit = sum % 10;

  return checkDigit === digits[8];
}