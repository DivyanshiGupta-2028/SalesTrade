
export interface OptionSettingModel {
  exchangeId: number;
  optionGroupId: number;
  optionGroupTittle: string;
  optionId: number;
  optionTitle: string;
  type: string;
  typeValues: string | undefined;
  selectedValue?: string;        
  description?: string;
  optionValue?: string;
  optionCode: string;

}
export interface UpdateOptionModel {
  exchangeId: number;
  optionId: number;
  typeValues?: string;
  optionCode: string;
  optionGroupId: number;
  optionValue?: string;

}
