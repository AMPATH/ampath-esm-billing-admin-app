import { getAsyncLifecycle, defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import { locationBillableServicesMetaData } from './dashboard-meta/facility-billable-services.meta';
import { createDashboardLink } from './createDashboardLink';
import { locationBillableDrugsMetaData } from './dashboard-meta/facility-billable-drugs.meta';

const moduleName = '@ampath/ampath-esm-billing-admin-app';

const options = {
  featureName: 'ampath-esm-billing-admin',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const billableServicesAdminRoot = getAsyncLifecycle(() => import('./billable-services/billable-services.root'), options);

export const billableDrugsAdminRoot = getAsyncLifecycle(() => import('./billable-drugs/billable-drugs.root'), options);

export const locationBillableServicesLink = getSyncLifecycle(
  createDashboardLink(locationBillableServicesMetaData as any),
  options,
);

export const locationBillableDrugsLink = getSyncLifecycle(
  createDashboardLink(locationBillableDrugsMetaData as any),
  options,
);