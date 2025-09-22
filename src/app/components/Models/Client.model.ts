// models/client.model.ts
export interface Client {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company_Name?: string;
  project_Name?: string;
  country: string;
  state?: string;
  address?: string;
  gst_No?: string;
  created_Datetime?: Date;
  updated_Datetime?: Date;
  status?: string;
  user_id: number;
}

// export interface Country {
//   id: number;
//   name: string;
//   code?: string;
// }

export interface Country {
  id: number;
  name: string;
  sortName: string;
  phoneCode: string;
}
export interface AccountsCountry {
  countryId: number;
  countryName: string;
  dialCode: string;
  countryCode: string;
}


export interface State {
  id: number;
  name: string;
  countryId: number;
  code?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ClientResponse {
  clientId: number;
  message: string;
}


export interface UserProfile {
  id: string;
  userId:string;
  userName: string; 
  email: string;
  firstName: string;
  lastName: string;
}



export interface LicenseClientContact {
  id?: number;
  userId: string;
  licenseId: number;
  licenseClientId: number;
  title?: string;
  firstname: string;
  lastname?: string;
  //positionTitle?: string;
  otherPositionTitle?: string;
  emailAddress: string;
  telephone1?: string;
  telephone2?: string;
  mobile?: string;
  isPrimaryContact: boolean;
  isActive: boolean;
  gender?: string;
  dateOfBirth?: Date;
  departmentId?: number;
  positionId?: number;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    addressLine4?: string;
    country?: number;
    state?: string;
    otherState?: string;
    pincode?: number;
    isPrimaryAddress?:boolean

}

export interface Department {
  id: number;
  name: string;
}

export interface PositionsTitle {
  id: number;
  positionName: string;
}

export interface ClientAddress {
 clientAddressId: number;
  clientAddressName: string;
}


export interface ExchangeClientAddress {
  addressID?: number | null;
  exchangeClientId: number |null;
  //exchangeClientContactId: number | null;
  clientAddressId?: number |null;

  // addressType: string;

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
