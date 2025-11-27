export class PromoCode {
  private _code: string;
  private _discountType: 'percentage' | 'fixed';
  private _value: number;
  private _minOrderValue: number;
  private _isActive: boolean;

  constructor(
    code: string,
    discountType: 'percentage' | 'fixed',
    value: number,
    minOrderValue: number = 0
  ) {
    this._code = code.toUpperCase();
    this._discountType = discountType;
    this._value = value;
    this._minOrderValue = minOrderValue;
    this._isActive = true;
  }

  get code(): string { return this._code; }
  get discountType(): 'percentage' | 'fixed' { return this._discountType; }
  get value(): number { return this._value; }
  get minOrderValue(): number { return this._minOrderValue; }
  get isActive(): boolean { return this._isActive; }

  calculateDiscount(orderTotal: number): number {
    if (!this._isActive || orderTotal < this._minOrderValue) {
      return 0;
    }

    if (this._discountType === 'percentage') {
      return orderTotal * (this._value / 100);
    } else {
      return Math.min(this._value, orderTotal);
    }
  }
}
