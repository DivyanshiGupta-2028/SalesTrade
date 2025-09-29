// exchange-client.model.ts

// import { ExchangeClientAddress } from "./ExchangeClientAddress";
// import { ExchangeClientContact } from "./ExchangeClientContact";

// export interface ExchangeClient {
//   exchangeClientId: number;
//   publicGUID: string| null;
//   exchangeID: number;
//   parentClientID?: number;
//   businessType: string;
//   referingClientId?: number;
//   businessName: string;
//   legalName: string;
//   taxReferenceGeneral?: string;
//   taxReferenceSales?: string;
//   kyc?: string;
//   cashRevenue?: number | null;
//   website?: string;
//   profileDescription?: string;
//   currentStatus: boolean;       // ✅ Required - यह string है, boolean नहीं!
//   isLegalDocumentationHeld: boolean;
//   isTaxReportingExempt: boolean;
//   total12MonthIncome?: number | null;
//   numberOfEmployee?: number | null;
//   canSendMessages: boolean;
//   canReceiveMessages: boolean;
//   isListedInDirectory: boolean;
//   isListedOnWebsite: boolean;
//   isActive: boolean;
//   isExchangeMember: boolean;
//   hasPermissionToUseInvoiceSystem: boolean;
//   dateSignup?: string | null;         // ISO format expected
//   dateRenewal?: string | null;
//   lastRenewedDate?: string | null;
//   businessStartDate?: string | null;
//   dateCreated: string;
//   dateModified?: string;
// }

// export interface ExchangeClientPayload {
//   exchangeClient: ExchangeClient;
//   addresses: ExchangeClientAddress[];
//   contacts: ExchangeClientContact[];
// }


export interface LicenseClient {
  licenseClientId: number;
  userId: string;
  licenseID: number;
  parentClientID?: number;
  businessType: string;
  referingClientId?: number;
  referingClientName?: string;
  businessName: string;
  legalName: string;
  website: string;
  kyc: string;
  profileDescription: string;
  numberOfEmployee: number;
  businessStartDate?: string;
  cashRevenue: number;
  total12MonthIncome: number;
  taxReferenceSales: string;
  taxReferenceGeneral: string;
  currentStatus: boolean;
  dateCreated: Date;
  dateRenewal?: Date;
  lastRenewedDate?: Date;
  isActive: boolean;
  isListedOnWebsite: boolean;
  isListedInDirectory: boolean;
  isLegalDocumentationHeld: boolean;
  isTaxReportingExempt: boolean;
  isLicenseMember: boolean;
  canSendMessages: boolean;
  canReceiveMessages: boolean;
  hasPermissionToUseInvoiceSystem: boolean;
}

export interface LicenseClientView {
  licenseClientId: number;
  //publicGUID: string | null;
  licenseID: number;
  parentClientID?: number;
  businessType: string;
  referingClientId?: number;
  referingClientName?: string;
  businessName: string;
  legalName: string;
  website: string;
  kyc: string;
  profileDescription: string;
  numberOfEmployee: number;
  businessStarted: string;
  businessStartedDate: Date;
  cashRevenue: number;
  total12MonthIncome: number;
  taxReferenceSales: string;
  taxReferenceGeneral: string;
  currentStatus: boolean;
  dateCreated: string;
  renewal: string;
  lastRenewed: string;
  isActive: boolean;
  isListedOnWebsite: boolean;
  isListedInDirectory: boolean;
  isLegalDocumentationHeld: boolean;
  isTaxReportingExempt: boolean;
  isLicenseMember: boolean;
  canSendMessages: boolean;
  canReceiveMessages: boolean;
  hasPermissionToUseInvoiceSystem: boolean;
}


export interface LicenseClientPayload {
  LicenseClient: LicenseClient;

}

