import React, { useEffect, useState } from 'react';
import styles from './billable-services.root.scss';
import { Button, InlineLoading } from '@carbon/react';
import { useSession } from '@openmrs/esm-framework';
import { fetchBillableServices } from '../resources/billable-services.resource';
import { type BillableService } from '../shared/types';
import BillableServicesList from './list/billable-services-list';
import AddBillableServiceModal from './modal/create-billable-service/create-billable-service.modal';
const BillableServicesRoot: React.FC = () => {
  const [billableServices, setBillableServices] = useState<BillableService[]>([]);
  const session = useSession();
  const location = session.sessionLocation;
  const locationUuid = location?.uuid ?? '';
  const [showCreateBillableServiceModal, setShowCreateBillableServiceModal] = useState<boolean>(false);
  const [selectedBillableService, setSelectedBillableService] = useState<BillableService | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (locationUuid) {
      getBillableServices();
    }
  }, [locationUuid]);
  if (loading) {
    return <InlineLoading description="Please wait.." />;
  }
  async function getBillableServices() {
    setLoading(true);
    const resp = await fetchBillableServices(location?.uuid ?? '');
    if (resp) {
      setBillableServices(resp);
    }
    setLoading(false);
  }
  function handleCreateBillableSercice() {
    setShowCreateBillableServiceModal(false);
    refresh();
  }
  function handleShowAddBillableServiceModal() {
    setShowCreateBillableServiceModal(true);
  }
  async function refresh() {
    await getBillableServices();
  }
  return (
    <>
      <div className={styles.bsContainer}>
        <div className={styles.bsHeader}>
          <div className={styles.bsTitle}>
            <h5>Facility Billable Services</h5>
          </div>
          <div className={styles.bsAction}>
            <Button onClick={handleShowAddBillableServiceModal}>+ Add new Service</Button>
            <Button onClick={refresh} kind="tertiary">
              Refresh
            </Button>
          </div>
        </div>
        <div className={styles.bsContent}>
          {billableServices && billableServices.length > 0 && locationUuid ? (
            <>
              <BillableServicesList
                billableServices={billableServices}
                locationUuid={locationUuid}
                onRefresh={refresh}
              />
            </>
          ) : (
            <></>
          )}
        </div>
        {showCreateBillableServiceModal && (
          <AddBillableServiceModal
            locationUuid={locationUuid}
            open={showCreateBillableServiceModal}
            onClose={handleCreateBillableSercice}
            onSuccess={handleCreateBillableSercice}
          />
        )}
      </div>
    </>
  );
};
export default BillableServicesRoot;
