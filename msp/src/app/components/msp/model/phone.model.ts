/**
 * Just static members
 */
export class PhoneNumber {
  static PhoneNumberRegEx = '^[2-9]{1}\\d{2}[\\-]?\\d{3}[\\-]?\\d{4}$';

  /**
   * The last 10 digits of a phone number. The phone field stores 10 digits
   * ("2143234323"); a session saved earlier may hold "+1 (214) 323-4323".
   * Both give "2143234323".
   */
  static toTenDigits(value: string | null | undefined): string {
    return String(value ?? '').replace(/\D/g, '').slice(-10);
  }

  /**
   * Display form "+1 (214) 323-4323". Empty input gives ''. A value with fewer
   * than 10 digits is returned unchanged.
   */
  static format(value: string | null | undefined): string {
    const digits = PhoneNumber.toTenDigits(value);
    if (digits.length !== 10) {
      return value ?? '';
    }
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
}
