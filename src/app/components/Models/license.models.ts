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
  isActive?: boolean;
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
  renewal?: boolean;
  addressLine1: string,
  addressLine2: string,
  addressLine3: string,
  addressLine4: string;
  state:string,
  otherState: string,
  pincode: string,
  mobile: number,
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
  isActive?: boolean;
 // renewal?: boolean;
}



export interface ExchangeDomain {
  domainId?:number;
  licenseId?: number;
  applicationmT?: number;  
  licenseName: string; 
  hasPermission: boolean;
}





export interface LicenseFlow {
  licenseId: number;
  userId: string;
  businessName: string;
  legalName: string;
  businessType: string;
  taxReferenceGeneral: string;
  taxReferenceSales: string;
  kyc: string;
  cashRevenue: number; // numeric string as per pattern /^\d*$/
  total12MonthIncome: number;
  numberOfEmployee: number;
  businessStartDate: Date;
  lastRenewedDate: Date;
  dateRenewal: Date;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4?: string;
  country: string;
  state: string;
  otherState?: string;
  pincode: string;
  website?: string;
  mobile?: string;
  profileDescription?: string;
  currency: string;
  language: string;
  localization: string;
  referencePrefix: string;
  isActive?: boolean;
  licenseType: string;
  licenseDuration: string;
  startDate: Date;
  endDate: Date;
  renewal?: boolean;
  currentStatus: boolean;
  isLegalDocumentationHeld: boolean;
  isTaxReportingExempt: boolean;
  canSendMessages: boolean;
  canReceiveMessages: boolean;
  isListedInDirectory: boolean;
  isListedOnWebsite: boolean;
  isLicenseMember: boolean;
  hasPermissionToUseInvoiceSystem: boolean;
}



