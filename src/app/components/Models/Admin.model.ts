
export interface Admin {
  id?: number;
  name: string;
}

export interface RolesModel {
  id? : string
  name?: string
}



export interface UserDetail {
  userId: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4?: string;
  country: string;
  state: string;
  otherState?: string;
  pincode: string;
  mobile?: string;
  role?: number
}