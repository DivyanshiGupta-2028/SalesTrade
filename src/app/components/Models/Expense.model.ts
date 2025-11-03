export interface ExpenseModel {
  id?: number | null;
  vendor_Name?: string |null;
  Payment_Purpose?: string |null;
  amount_Paid: number;
  bill_Amount: number;
  cheque_Number: number;
  tds: number;
  category_id: number;
  payment_Method: string;
  payment_Date: string;
  gst_Bill?: boolean | null;
  tds_Bill?: boolean |null;
  //bill_File: File | null;
}


