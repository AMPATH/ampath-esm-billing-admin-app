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
  concept?: Concept;
};

export type ServiceType = {
  uuid: string;
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

export type CreateBillableServiceServicePrice = {
  paymentMode: string;
  name: string;
  price: number;
};
export type CreateBillableServiceDto = {
  name: string;
  shortName: string;
  serviceType: string;
  location: string;
  servicePrices: CreateBillableServiceServicePrice[];
  serviceStatus: string;
  concept?: string;
};

export type PaymentModesResponse = {
  results: PaymentMode[];
};
export type BillableServiceTypeResp = {
  setMembers: ServiceType[];
  resourceVersion: string;
};
export type Concept = {
  display: string;
  concept: {
    uuid: string;
    display: string;
  };
  conceptName: {
    uuid: string;
    display: string;
  };
};
export type ConceptSearchResponse = {
  results: Concept[];
};

export type Drug = {
  display: string;
  uuid: string;
  name: string;
  description: string | null;
  retired: boolean;
  dosageForm: string;
  maximumDailyDose: string | null;
  minimumDailyDose: string | null;
  concept: Concept;
  combination: boolean;
  strength: string | null;
  drugReferenceMaps: [];
  ingredients: [];
  links: Link[];
  resourceVersion: string;
};

export type Link = {
  rel: string;
  uri: string;
  resourceAlias: string;
};
export type DrugReponse = {
  results: Drug[];
}

export type BillableDrugsResp = {
  results: BillableDrug[]
}
export type BillableDrug = {

}
