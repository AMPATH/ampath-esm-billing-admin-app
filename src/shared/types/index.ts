export type BillableServiceResp = {
  results: BillableService[];
};
export type BillableService = {
  uuid: string;
  name?: string;
  display?: string;
  shortName: string;
  serviceStatus: 'ENABLED' | 'DISABLED';
  serviceType: ServiceType | null;
  servicePrices: ServicePrice[];
  resourceVersion: string;
  location: {
    uuid: string;
    display: string;
  };
};

export type ServiceType = {
  display: string;
  resourceVersion: string;
};

export type ServicePrice = {
  uuid: string;
  name: string;
  price: number;
  item: string;
  paymentMode: PaymentMode;
  billableService: BillableService;
  resourceVersion: string;
};

export type PaymentMode = {
  uuid: string;
  name: string;
  description: string | null;
  retired: boolean;
  retireReason: string;
  attributeTypes: unknown[];
  sortOrder: number | null;
  resourceVersion: string;
};
