
export interface OptionSettingModel {
  exchangeId: number;
  optionGroupId: number;
  optionGroupTittle: string;
  optionId: number;
  optionTitle: string;
  type: string;
  typeValues: string | undefined; // This holds the list of radio/dropdown options (JSON or CSV)
  selectedValue?: string;        // ✅ Add this to hold current selection
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
