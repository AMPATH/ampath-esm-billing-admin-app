import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import {
  type CreateBillableServiceDto,
  type BillableServiceResp,
  type PaymentModesResponse,
  type BillableServiceTypeResp,
} from '../shared/types';
import { BILLABLE_SERVICE_CONCEPT_UUID } from '../shared/constants';

export async function fetchBillableServices(locationUuid: string): Promise<any> {
  const url = `${restBaseUrl}/billing/billableService?v=full&&locationUuid=${locationUuid}`;
  const response = await openmrsFetch(url);
  const data = (await response.json()) as BillableServiceResp;
  return data.results ?? [];
}

export async function createBillableSrevice(payload: CreateBillableServiceDto) {
  const url = `${restBaseUrl}/billing/billableService`;
  return openmrsFetch(url, {
    method: 'POST',
    body: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function fetchPaymentModes(): Promise<any> {
  const url = `${restBaseUrl}/billing/paymentMode`;
  const response = await openmrsFetch(url);
  const data = (await response.json()) as PaymentModesResponse;
  return data.results ?? [];
}
export async function fetchBillableServiceTypes() {
  const url = `${restBaseUrl}/concept/${BILLABLE_SERVICE_CONCEPT_UUID}`;
  const response = await openmrsFetch(url);
  const data = (await response.json()) as BillableServiceTypeResp;
  return data.setMembers ?? [];
}
