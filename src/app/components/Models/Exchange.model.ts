export interface Exchange {
  exchangeId?: number;
  exchangeParentId?: number;  
  exchangeName: string;
  currency: string;
  localization: string;
  country: string;
  language: string;
  exchangeOwnerId: string;
  referencePrefix: string;
  dateCreated?: Date;
  dateModified?: Date;  
  isActive: boolean;
}









