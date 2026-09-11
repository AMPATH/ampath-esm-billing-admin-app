import React, { useMemo, useState } from 'react';
import { Button, InlineLoading, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextInput } from '@carbon/react';
import { type BillableService } from '../../shared/types';
import styles from './billable-services-list.scss';
import EditBillableServiceModal from '../modal/edit-billable-service/edit-billable-service.modal';
import { deleteBillableService } from '../../resources/billable-services.resource';
import { showSnackbar } from '@openmrs/esm-framework';
interface billableServiceProps {
  billableServices: BillableService[];
  locationUuid: string;
  onRefresh: ()=>void;
}
const BillableServicesList: React.FC<billableServiceProps> = ({ billableServices, locationUuid, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading,setLoading] = useState(false);
  const filteredBillableServicesList = useMemo(
    () => filterBillableServices(searchTerm),
    [searchTerm, billableServices],
  );
  const [showEditBillableServiceModal, setShowEditBillableServiceModal] = useState<boolean>(false);
  const [selectedBillableService, setSelectedBillableService] = useState<BillableService | null>(null);
  if (!billableServices || billableServices.length === 0) {
    return <>No Billable service</>;
  }
  if(loading){
     return <InlineLoading  description='Please wait..'/>
  }
  function filterBillableServices(searchString: string): BillableService[] {
    if (!searchString) {
      return billableServices;
    }
    return billableServices.filter((bs) => {
      return bs?.display?.toLowerCase().trim().includes(searchString.toLowerCase().trim());
    });
  }
  function handleCloseEditBillableServiceModal() {
    setShowEditBillableServiceModal(false);
    onRefresh();
  }
  function handleEditBillableService(billableService: BillableService) {
    setSelectedBillableService(billableService);
    setShowEditBillableServiceModal(true);
  }
  async function handleDeleteBillableService(billableService: BillableService) {
    setLoading(true);
    try {
      await deleteBillableService(billableService.uuid);
    } catch (error) {
      showSnackbar({
        kind: 'error',
        title: 'Error deleting billable service',
        subtitle: 'An error ocurred while deleting the billable service. Kindly try again or contact support',
      });
      onRefresh();
    }finally{
      setLoading(false);
    }
  }
  return (
    <>
      <div className={styles.listLayout}>
        <div className={styles.listHeader}>
          <div className={styles.listSearch}>
            <TextInput
              id="billable-service-search"
              labelText="Search"
              onChange={(e) => setSearchTerm(e?.target.value)}
            />
          </div>
        </div>
        <div className={styles.listContent}>
          <div className={styles.listData}>
            <Table size="lg">
              <TableHead>
                <TableRow>
                  <TableHeader>No</TableHeader>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Short Name</TableHeader>
                  <TableHeader>Type</TableHeader>
                  <TableHeader>Concept</TableHeader>
                  <TableHeader>Location</TableHeader>
                  <TableHeader>Prices</TableHeader>
                  <TableHeader>Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBillableServicesList &&
                  filteredBillableServicesList.map((bs, index) => {
                    return (
                      <>
                        <TableRow key={bs.uuid}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{bs.display}</TableCell>
                          <TableCell>{bs.shortName}</TableCell>
                          <TableCell>{bs.serviceType?.display}</TableCell>
                          <TableCell>{bs?.concept?.display ?? ''}</TableCell>
                          <TableCell>{bs?.location?.display}</TableCell>
                          <TableCell>
                            {bs.servicePrices.map((sp) => {
                              return `${sp.paymentMode.name}(${sp.price}) `;
                            })}
                          </TableCell>
                          <TableCell>
                            <Button kind="ghost" size="sm" onClick={() => handleEditBillableService(bs)}>
                              {' '}
                              Edit
                            </Button>
                            <Button kind="ghost" size="sm" onClick={() => handleDeleteBillableService(bs)}>
                              {' '}
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {showEditBillableServiceModal && selectedBillableService && (
        <EditBillableServiceModal
          locationUuid={locationUuid}
          open={showEditBillableServiceModal}
          onClose={handleCloseEditBillableServiceModal}
          onSuccess={handleCloseEditBillableServiceModal}
          billableService={selectedBillableService}
        />
      )}
    </>
  );
};

export default BillableServicesList;
