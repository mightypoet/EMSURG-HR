/**
 * Converts numbers into Indian numbering system words (Lakhs, Crores, Thousands).
 */
export function numberToIndianWords(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
  if (isNaN(n) || n === 0) return 'Zero Rupees';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const twoDigits = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tensMultiple = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n === 0) return '';
    if (n < 10) return singleDigits[n];
    if (n >= 10 && n < 20) return twoDigits[n - 10];
    return tensMultiple[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + singleDigits[n % 10] : '');
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    let str = '';
    if (hundred > 0) {
      str += singleDigits[hundred] + ' Hundred';
      if (remainder > 0) str += ' and ';
    }
    if (remainder > 0) {
      str += convertTwoDigits(remainder);
    }
    return str;
  }

  const integerPart = Math.floor(Math.abs(n));
  if (integerPart === 0) return 'Zero Rupees';

  let remaining = integerPart;
  const parts: string[] = [];

  // Crores (1,00,00,000)
  const crores = Math.floor(remaining / 10000000);
  if (crores > 0) {
    parts.push(convertThreeDigits(crores) + ' Crore');
    remaining %= 10000000;
  }

  // Lakhs (1,00,000)
  const lakhs = Math.floor(remaining / 100000);
  if (lakhs > 0) {
    parts.push(convertTwoDigits(lakhs) + ' Lakh');
    remaining %= 100000;
  }

  // Thousands (1,000)
  const thousands = Math.floor(remaining / 1000);
  if (thousands > 0) {
    parts.push(convertTwoDigits(thousands) + ' Thousand');
    remaining %= 1000;
  }

  // Hundreds and tens
  if (remaining > 0) {
    parts.push(convertThreeDigits(remaining));
  }

  return parts.join(' ').trim() + ' Rupees Only';
}

/**
 * Formats a number to Indian currency format e.g. 950000 -> "9,50,000"
 */
export function formatIndianCurrency(num: number | string): string {
  if (!num) return '0';
  const clean = typeof num === 'string' ? num.replace(/[^\d.-]/g, '') : num.toString();
  const val = parseFloat(clean);
  if (isNaN(val)) return '0';
  
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(val);
}

/**
 * Formats a date string like "2026-09-26" to "26th September 2026" or "26/09/2026"
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'long' });
    const year = d.getFullYear();
    
    const suffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${day}${suffix(day)} ${month}, ${year}`;
  } catch {
    return dateStr;
  }
}
