export interface ExpenseModel {
  id?: number | null;
  vendor_name: number |null;
  clientAddressId?: number |null;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  country?: number;
  state?: string;
  pincode?: string;
  countryName?: string;
  latitude?: string;
  longitude?: string;
}
