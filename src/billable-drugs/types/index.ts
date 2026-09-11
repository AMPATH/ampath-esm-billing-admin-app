import { type PaymentMode, type Drug } from "../../shared/types";

export type DrugPrice = {
     name:  string; 
     price: number;
     paymentMode: PaymentMode;
}

export type BillableDrug = {
  uuid: string;
  name: string;
  shortName:  string;
  drug: Drug;
  location:  {
    display: string;
    uuid: string;
  };
  status:  string;
  drugPrices: DrugPrice[];
}
export type CreateBillableDrugDto = {
  name: string;
  shortName: string;
  drug: string;
  location: string;
  status:  string;
  drugPrices: DrugPrice[];
}
export type EditBillableDrugDto = {
  name: string;
  shortName: string;
  drug: string;
  location: string;
  status:  string;
  drugPrices: DrugPrice[];
}