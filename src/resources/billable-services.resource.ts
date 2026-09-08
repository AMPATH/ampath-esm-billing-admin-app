import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import { type BillableServiceResp } from "../shared/types";

export async function fetchBillableServices(
  locationUuid: string,
): Promise<any> {
  const url = `${restBaseUrl}/billing/billableService?v=full&&locationUuid=${locationUuid}`;
  const response = await openmrsFetch(url);
  const data = await response.json() as BillableServiceResp;
  return data.results ?? [];
}