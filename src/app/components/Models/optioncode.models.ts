export interface OptionCodeModel {
  optionId?: number;         
  optionCode: string;         
  optionTitle: string;        
  description?: string;        
  type: string;                
  typeValues?: string;    
  optionGroupId?: number;
 
 
}
export interface FilterOptionCodeModel {
  exchangeId: number;
}
