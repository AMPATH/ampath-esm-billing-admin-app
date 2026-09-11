import React, { useEffect, useMemo, useState } from 'react';
import { Button, InlineLoading, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextInput } from '@carbon/react';
import { type BillableDrug } from '../types';
import styles from './billable-drugs-list.scss';
import EditBillableDrugModal from '../modal/edit-billable-drug/edit-billable-drug.modal';
import { deleteBillableDrug } from '../../resources/billable-drug.resource';
import { showSnackbar } from '@openmrs/esm-framework';

interface billableDrugsProps {
  billableDrugs: BillableDrug[];
  locationUuid: string;
  onRefresh: ()=>void
}
const BillableDrugsList: React.FC<billableDrugsProps> = ({ billableDrugs, locationUuid, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const filteredDrugList = useMemo(() => filterBillableDrugs(searchTerm), [searchTerm, billableDrugs]);
  const [showEditBillableDrugsModal, setShowEditBillableDrugModal] = useState<boolean>(false);
  const [selectedBillableDrug, setSelectedBillableDrug] = useState<BillableDrug | null>(null);
  const [loading,setLoading] = useState(false);
  if (!billableDrugs || billableDrugs.length === 0) {
    return <>No Billable Drugs</>;
  }
  function filterBillableDrugs(searchString: string): BillableDrug[] {
    if (!searchString) {
      return billableDrugs;
    }
    return billableDrugs.filter((bd) => {
      return bd?.name.toLowerCase().trim().includes(searchString.toLowerCase().trim());
    });
  }
  function handleCloseEditBillableDrugModal() {
    setShowEditBillableDrugModal(false);
    onRefresh();
  }
  function handleEditBillableDrug(billableDrug: BillableDrug) {
    setSelectedBillableDrug(billableDrug);
    setShowEditBillableDrugModal(true);
  }
  async function handleDeleteBillableDrug(billableDrug: BillableDrug) {
      setLoading(true);
      try {
        await deleteBillableDrug(billableDrug.uuid);
        showSnackbar({
          kind: 'success',
          title: 'Succesfully Deleted Billable Drug',
          subtitle: `An error ocurred while deleting the billable drug. Kindly try again or contact support`,
        });
      } catch (error) {
        showSnackbar({
          kind: 'error',
          title: 'Error deleting billable drug',
          subtitle: `An error ocurred while deleting the ${billableDrug?.name ?? 'Billable drug'}. Kindly try again or contact support`,
        });
      }finally{
        setLoading(false);
      }
  }
  if(loading){
     return <InlineLoading  description='Loading....'/>
  }
  return (
    <>
      <div className={styles.listLayout}>
        <div className={styles.listHeader}>
          <div className={styles.listSearch}>
            <TextInput id="drug-search-name" labelText="Search" onChange={(e) => setSearchTerm(e?.target.value)} />
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
                  <TableHeader>Drug</TableHeader>
                  <TableHeader>Location</TableHeader>
                  <TableHeader>Prices</TableHeader>
                  <TableHeader>Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDrugList.map((bd, index) => {
                  return (
                    <>
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{bd.name}</TableCell>
                        <TableCell>{bd.shortName}</TableCell>
                        <TableCell>{bd?.drug?.display}</TableCell>
                        <TableCell>{bd?.location?.display ?? ''}</TableCell>
                        <TableCell>
                          {bd.drugPrices.map((dp) => {
                            return `${dp.paymentMode?.name}(${dp.price}) `;
                          })}
                        </TableCell>
                        <TableCell>
                          <Button kind="ghost" size="sm" onClick={() => handleEditBillableDrug(bd)}>
                            {' '}
                            Edit
                          </Button>
                          <Button kind="ghost" size="sm" onClick={() => handleDeleteBillableDrug(bd)}>
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

      {showEditBillableDrugsModal && selectedBillableDrug && (
        <EditBillableDrugModal
          locationUuid={locationUuid}
          open={showEditBillableDrugsModal}
          onClose={handleCloseEditBillableDrugModal}
          onSuccess={handleCloseEditBillableDrugModal}
          billableDrug={selectedBillableDrug}
        />
      )}
    </>
  );
};

export default BillableDrugsList;
