export interface JWT{
  token: string;
}
export interface User{
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  permissions: string[];
}
export interface Order {
  id: number;
  status: string;
  createdBy: User;
  active: boolean;
  items: Dish[];
}

export interface Dish {
  id: number;
  name: string;
  category?:string;
  description?:string;
}

export interface OrderRequest {
  userId: number;
  dishIDs: number[];
  scheduledTime?: string;
}

export interface StatusRequest {
  userID?: number;
  statuses: string[];
}

export interface CancelRequest {
  orderID: number;
}
export interface ErrorMessage {
  id: number;
  message: string;
  timestamp: string;
}
