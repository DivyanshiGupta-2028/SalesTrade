
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

