import { isNullish, isString, isValidNumber } from 'jet-validators';
import { parseBoolean } from 'jet-validators/utils';


/******************************************************************************
                                   Setup
******************************************************************************/

// Money formatter
const MoneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});


/******************************************************************************
                                 Functions
******************************************************************************/

/**
 * Capitalize all the letters in a string.
 */
function capitalize(arg: string): string {
  return arg.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert number bytes to pretty string. Max 3 numbers.
 * 
 * @example 1_123_412_34 => "1.12 MB"
 */
function bytesToStr(bytes?: number | string | null): string {
  if (isNullish(bytes)) {
    return '';
  }
  if (isString(bytes)) {
    if (isValidNumber(bytes)) {
      bytes = Number(bytes);
    } else {
      return '';
    }
  }
  if (bytes >= 1_000_000_000) {
    return _bytesToStrHelper(bytes / 1_000_000_000) + ' GB';
  } else if (bytes >= 1_000_000 && bytes < 1_000_000_000) {
    return (_bytesToStrHelper(bytes / 1_000_000) + ' MB');
  } else {
    return (_bytesToStrHelper(bytes / 1_000) + ' KB');
  }
}

/**
 * Format to show no more than 3 number (but still include decimal place).
 */
function _bytesToStrHelper(size: number) {
  const retVal = String(size).substring(0, 4);
  if (retVal.includes('.') && !retVal.endsWith('.')) {
    return retVal;
  } else {
    return retVal.substring(0, 3);
  }
}

/**
 * replaceAll() does not work in TypeScript so we have to use this
 */
function replaceAll(
  parent: string,
  toFind: string,
  replaceWith: string,
): string {
  const rgx = new RegExp(toFind, 'g');
  return parent.replace(rgx, replaceWith);
}

/**
 * Display 1234.1234 => "$1,234.12"
 */
function formatMoney(amount: number) {
  return MoneyFormatter.format(amount);
}

/**
 * Return the string value for a boolean
 */
function formatBool(arg: unknown): 'True' | 'False' {
  arg = parseBoolean(arg);
  if (arg) {
    return 'True';
  } else {
    return 'False';
  }
}

/**
 * Compare the raw value of two strings.
 */
function isEqual(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}


/******************************************************************************
                                Export default
******************************************************************************/

export default {
  capitalize,
  bytesToStr,
  replaceAll,
  formatMoney,
  formatBool,
  isEqual,
} as const;
