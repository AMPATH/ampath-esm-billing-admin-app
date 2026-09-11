import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import { type BillableDrugsResp } from "../shared/types";
import { type EditBillableDrugDto, type CreateBillableDrugDto } from "../billable-drugs/types";

export async function fetchBillableDrugs(locationUuid: string): Promise<any> {
  const url = `${restBaseUrl}/billing/billableDrug?v=full&&locationUuid=${locationUuid}`;
  const response = await openmrsFetch(url);
  const data = (await response.json()) as BillableDrugsResp;
  return data.results ?? [];
}

export async function createBillableDrugs(payload: CreateBillableDrugDto) {
  const url = `${restBaseUrl}/billing/billableDrug`;
  return openmrsFetch(url, {
    method: 'POST',
    body: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function updateBillableDrugs(billableDrugUuid: string,payload: EditBillableDrugDto) {
  const url = `${restBaseUrl}/billing/billableDrug/${billableDrugUuid}`;
  return openmrsFetch(url, {
    method: 'POST',
    body: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function deleteBillableDrug(billableDrugUuid: string) {
  const url = `${restBaseUrl}/billing/billableDrug/${billableDrugUuid}`;
  return openmrsFetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}