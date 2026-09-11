import React, { useEffect, useState } from 'react';
import {
  Button,
  ComboBox,
  Modal,
  ModalBody,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextInput,
} from '@carbon/react';
import styles from './edit-billable-drug.modal.scss';
import { showSnackbar } from '@openmrs/esm-framework';
import { type PaymentMode, type Drug } from '../../../shared/types';
import { type DrugPrice, type BillableDrug, type EditBillableDrugDto } from '../../types';
import { drugSearch } from '../../../resources/drug.resource';
import { fetchPaymentModes } from '../../../resources/billable-services.resource';
import { updateBillableDrugs } from '../../../resources/billable-drug.resource';

interface EditBillableDrugModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locationUuid: string;
  billableDrug: BillableDrug;
}
const EditBillableDrugModal: React.FC<EditBillableDrugModalProps> = ({
  open,
  onClose,
  onSuccess,
  locationUuid,
  billableDrug,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(billableDrug?.name ?? '');
  const [shortName, setShortName] = useState<string>(billableDrug?.shortName ?? '');
  const [drugPrices, setDrugPrices] = useState<DrugPrice[]>(billableDrug.drugPrices ?? []);
  const [selectedDrugPrices, setSelectedDrugPrices] = useState<any[]>(billableDrug.drugPrices ?? []);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(billableDrug.name ?? '');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [drugResults, setDrugResults] = useState<Drug[]>([]);
  useEffect(() => {
    if (locationUuid) {
      getPaymentModes();
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    getDrugs();
    return () => {
      controller.abort();
    };
  }, [searchTerm]);
  async function getPaymentModes() {
    const resp = await fetchPaymentModes();
    if (resp) {
      setPaymentModes(resp);
    }
  }

  async function handleAddBillableDrugItem() {
    setLoading(true);
    const updateBillableDrugDto = getBillableDrugDto();
    if (!isValidEditBillableDrugDto(updateBillableDrugDto)) {
      setLoading(false);
      return false;
    }

    try {
      const resp = await updateBillableDrugs(billableDrug.uuid, updateBillableDrugDto);
      if (resp) {
        showSnackbar({
          kind: 'success',
          title: 'Billable Drug updated succesfully',
          subtitle: `${name} Billable Drug updated succesfully`,
        });
        onSuccess();
      }
    } catch (error) {
      showSnackbar({
        kind: 'error',
        title: 'Error updating billable drug',
        subtitle: 'An error occurred while adding updating billable drug. Kindy retry or contact support',
      });
    } finally {
      setLoading(false);
    }
  }
  function getBillableDrugDto(): EditBillableDrugDto {
    const editBillableDrugDto: EditBillableDrugDto = {
      name: name,
      shortName: shortName,
      drug: selectedDrug?.uuid ?? '',
      location: locationUuid,
      drugPrices: selectedDrugPrices.map((sp) => {
        return {
          paymentMode: sp.paymentMode.uuid,
          name: sp.paymentMode.name,
          price: sp.price,
        };
      }),
      status: 'ENABLED',
    };

    return editBillableDrugDto;
  }
  function holderFunction() {
    return;
  }
  function handleAddServicePriceControl() {
    const newServicePrices = [
      ...selectedDrugPrices,
      {
        name: selectedPaymentMode?.name ?? '',
        paymentMode: selectedPaymentMode ?? '',
        price: selectedPrice ?? 0,
      },
    ];
    setSelectedDrugPrices(newServicePrices);
  }
  function handleSelectPaymentMode(paymentMode: PaymentMode | null | undefined) {
    if (paymentMode) {
      setSelectedPaymentMode(paymentMode);
    } else {
      setSelectedPaymentMode(null);
    }
  }
  function handlePriceChange(value: any) {
    setSelectedPrice(value?.target?.value ? Number(value?.target?.value) : 0);
  }
  function handleRemoveSp(i: number) {
    const newSelectedDrugPrices = selectedDrugPrices.filter((s, index) => {
      return index !== i;
    });
    setSelectedDrugPrices(newSelectedDrugPrices);
  }
  async function getDrugs() {
    if (searchTerm && searchTerm.length > 3) {
      const resp = await drugSearch(searchTerm);
      if (resp) {
        setDrugResults(resp);
      }
    }
  }
  function handleDrugSelect(selectedDrug: Drug) {
    setSearchTerm('');
    setSelectedDrug(selectedDrug);
    setDrugResults([]);
  }
  function handleConceptClear() {
    setSearchTerm('');
    setSelectedDrug(null);
  }
  function isValidEditBillableDrugDto(editBillableDrugDto: EditBillableDrugDto): boolean {
    if (!editBillableDrugDto.location) {
      showSnackbar({
        kind: 'error',
        title: 'Missing location',
        subtitle: 'Billable Drug location not set',
      });
      return false;
    }
    if (!editBillableDrugDto.name) {
      showSnackbar({
        kind: 'error',
        title: 'Missing Billable Drug name',
        subtitle: 'Billable Drug name not set',
      });
      return false;
    }
    if (!editBillableDrugDto.shortName) {
      showSnackbar({
        kind: 'error',
        title: 'Missing Billable Drug short name',
        subtitle: 'Billable Drug short name not set',
      });
      return false;
    }
    if (!editBillableDrugDto.drug) {
      showSnackbar({
        kind: 'error',
        title: 'Missing Drug',
        subtitle: 'Billable Drug short name not set',
      });
      return false;
    }
    if (!editBillableDrugDto.drugPrices) {
      showSnackbar({
        kind: 'error',
        title: 'Missing Billable Drug prices',
        subtitle: 'Billable Drug prices not set',
      });
      return false;
    }

    return true;
  }
  return (
    <>
      <Modal
        modalHeading="Edit Billable Drug"
        open={open}
        size="md"
        onSecondarySubmit={onClose}
        onRequestClose={onClose}
        onRequestSubmit={loading ? holderFunction : handleAddBillableDrugItem}
        primaryButtonText={loading ? 'Creating...' : 'Add'}
        secondaryButtonText="Close"
      >
        <ModalBody>
          <div className={styles.EditBillableDrugModalLayout}>
            <div className={styles.formRow}>
              <TextInput
                id="billable-drug-name"
                labelText="Name"
                onChange={(e) => setName(e?.target.value)}
                value={name}
              />
            </div>
            <div className={styles.formRow}>
              <TextInput
                id="billable-drug-short-name"
                labelText="Short Name"
                onChange={(e) => setShortName(e?.target.value)}
                value={shortName}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.drugSearch}>
                <div>
                  <TextInput
                    id="drugSearch"
                    labelText="Drug"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    placeholder="Search drug"
                    value={selectedDrug?.display ?? searchTerm}
                  />
                </div>
                <div>
                  {drugResults && drugResults.length > 0 ? (
                    <>
                      <div className={styles.fullW}>
                        <ul className={styles.drugsList}>
                          {drugResults?.map((drugResult) => (
                            <li
                              className={styles.service}
                              key={drugResult.uuid}
                              onClick={() => handleDrugSelect(drugResult)}
                              role="menuitem"
                            >
                              {drugResult.display}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className={styles.drugClearAction}>
                <Button kind="secondary" onClick={handleConceptClear}>
                  Clear
                </Button>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.paymentModeW}>
                <ComboBox
                  id={`payment-modes`}
                  titleText={`Payment Modes`}
                  placeholder="Payment Modes"
                  items={paymentModes ?? []}
                  itemToString={(item) => item?.name ?? ''}
                  onChange={({ selectedItem }) => handleSelectPaymentMode(selectedItem)}
                />
              </div>
              <div className={styles.priceW}>
                <TextInput id="price" labelText="Price" onChange={handlePriceChange} type="number" />
              </div>
              <div className={styles.addSp}>
                <Button kind="primary" onClick={handleAddServicePriceControl}>
                  Add
                </Button>
              </div>
            </div>
            {selectedDrugPrices && selectedDrugPrices.length > 0 ? (
              <>
                <Table size="md">
                  <TableHead>
                    <TableRow>
                      <TableHeader>No</TableHeader>
                      <TableHeader>Payment Mode</TableHeader>
                      <TableHeader>Price</TableHeader>
                      <TableHeader>Action</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDrugPrices.map((sp, index) => {
                      return (
                        <>
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{sp?.paymentMode?.name ?? ''}</TableCell>
                            <TableCell>{sp?.price ?? ''}</TableCell>
                            <TableCell>
                              <Button kind="ghost" onClick={() => handleRemoveSp(index)}>
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </>
            ) : (
              <></>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
export default EditBillableDrugModal;
