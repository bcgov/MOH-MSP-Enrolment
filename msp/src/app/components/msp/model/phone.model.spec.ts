import { PhoneNumber } from './phone.model';

describe('PhoneNumber', () => {
  describe('toTenDigits', () => {
    it('keeps a 10 digit model value', () => {
      expect(PhoneNumber.toTenDigits('2143234323')).toBe('2143234323');
    });

    it('strips the display format', () => {
      expect(PhoneNumber.toTenDigits('+1 (214) 323-4323')).toBe('2143234323');
    });

    it('drops a leading country code digit', () => {
      expect(PhoneNumber.toTenDigits('12143234323')).toBe('2143234323');
    });

    it('returns an empty string for empty, null and undefined', () => {
      expect(PhoneNumber.toTenDigits('')).toBe('');
      expect(PhoneNumber.toTenDigits(null)).toBe('');
      expect(PhoneNumber.toTenDigits(undefined)).toBe('');
    });
  });

  describe('format', () => {
    it('formats a 10 digit model value', () => {
      expect(PhoneNumber.format('2143234323')).toBe('+1 (214) 323-4323');
    });

    it('leaves an already formatted value unchanged', () => {
      expect(PhoneNumber.format('+1 (214) 323-4323')).toBe('+1 (214) 323-4323');
    });

    it('returns an empty string for empty, null and undefined', () => {
      expect(PhoneNumber.format('')).toBe('');
      expect(PhoneNumber.format(null)).toBe('');
      expect(PhoneNumber.format(undefined)).toBe('');
    });

    it('returns a partial number unchanged', () => {
      expect(PhoneNumber.format('214')).toBe('214');
    });
  });
});
