export interface License {
  licenseId?: number;
  userId: string;
  licenseParentId?: number;  
  companyName: string;
  currency: string;
  localization: string;
  country: string;
  countryName: string;
  stateName: string;
  language: string;
  licenseOwnerId: string;
  referencePrefix: string;
  dateCreated?: Date;
  dateModified?: Date;  
  isActive: boolean;
  licenseType: string;
  licenseDuration: string;
  firstName: string;
  lastName: string;
  startDate: Date;
  endDate: Date;
  expiry: Date;
  start: Date;
  title: string;
  parentCompanyName: string;
  renewal: string;
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  addressLine4: string;
  state:string,
  State: string,
  pincode: string,
  latitude: number,
  longitude: number,
}



export interface RenewLicenseModal {
  licenseType?: string;
  licenseId?: number; 
  licenseDuration: string;
  startDate: Date;
  endDate: Date;
  isActive?:boolean;
  companyName: string;
}


export interface LicenseActive {
  licenseId?: number;
  isActive: boolean;

}



export interface ExchangeDomain {
  domainId?:number;
  licenseId?: number;
  applicationmT?: number;  
  licenseName: string; 
  hasPermission: boolean;
}








