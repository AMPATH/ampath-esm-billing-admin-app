import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import { type BillableDrugsResp } from "../shared/types";
import { type CreateBillableDrugDto } from "../billable-drugs/types";

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