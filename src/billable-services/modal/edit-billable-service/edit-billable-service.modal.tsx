import React, { useEffect, useState } from 'react';
import {
  Button,
  ComboBox,
  Modal,
  ModalBody,
  Search,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TextInput,
} from '@carbon/react';
import styles from './edit-billable-service.modal.scss';
import { showSnackbar } from '@openmrs/esm-framework';
import {
  type PaymentMode,
  type ServicePrice,
  type ServiceType,
  type Concept,
  type BillableService,
  type UpdateBillableServiceDto,
} from '../../../shared/types';
import {
  fetchBillableServiceTypes,
  fetchPaymentModes,
  updateBillableService,
} from '../../../resources/billable-services.resource';
import { conceptSearch } from '../../../resources/concept.service';

interface EditBillableServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  locationUuid: string;
  billableService: BillableService;
}
const EditBillableServiceModal: React.FC<EditBillableServiceModalProps> = ({
  open,
  onClose,
  onSuccess,
  locationUuid,
  billableService
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(billableService?.name ?? '');
  const [shortName, setShortName] = useState<string>(billableService.shortName ?? '');
  const [serviceType, setServiceType] = useState<ServiceType | null>(billableService.serviceType);
  const [servicePrices, setServicePrices] = useState<ServicePrice[]>(billableService.servicePrices);
  const [selectedServicePrices, setSelectedServicePrices] = useState<any[]>(billableService?.servicePrices ?? []);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<PaymentMode | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [billableServiceTypes, setBillableServiceTypes] = useState<ServiceType[]>([]);
  const [searchTerm,setSearchTerm] = useState<string>(billableService?.name ?? '');
  const [selectedConcept,setSelectedConcept] = useState<Concept | null>(billableService.concept ?? null);
  const [conceptResults,setConceptResults] = useState<Concept[]>([]);
  useEffect(() => {
    if (locationUuid) {
      getPaymentModes();
      getBillableServiceTypes();
    }
  }, []);
  useEffect(()=>{
    const controller = new AbortController();
    getAssociatedConcepts();
    return () => {
      controller.abort();
    };
  },[searchTerm]);
  async function getPaymentModes() {
    const resp = await fetchPaymentModes();
    if (resp) {
      setPaymentModes(resp);
    }
  }
  async function getBillableServiceTypes() {
    const resp = await fetchBillableServiceTypes();
    if (resp) {
      setBillableServiceTypes(resp);
    } else {
      setBillableServiceTypes([]);
    }
  }
  async function handleAddBillableServiceItem() {
    setLoading(true);
    const addBillableServiceDto = getBillableServiceDto();
    if(!isValidUpdateBillableServiceDto(addBillableServiceDto)){
       setLoading(false);
       return false;
    }

    try {
      const resp = await updateBillableService(billableService.uuid,addBillableServiceDto);
      if(resp){
        showSnackbar({
        kind: 'success',
        title: 'Billable service updated succesfully',
        subtitle: `${name} billable service updated succesfully`,
      });
      onSuccess();
      }
    } catch (error) {
      showSnackbar({
        kind: 'error',
        title: 'Error Editing billable service',
        subtitle: 'An error occurred editing the billable service. Kindy retry or contact support',
      });
    } finally {
      setLoading(false);
    }
  }
  function getBillableServiceDto(): UpdateBillableServiceDto {
    const updateBillableServiceDto: UpdateBillableServiceDto = {
      name: name,
      shortName: shortName,
      serviceType: serviceType?.uuid ?? '',
      location: locationUuid,
      servicePrices: selectedServicePrices.map((sp)=>{
          return {
              paymentMode: sp.paymentMode.uuid,
              name: sp.paymentMode.name,
              price: sp.price,
          }
      }),
      serviceStatus: "ENABLED",
    };
    if(selectedConcept){
        updateBillableServiceDto['concept'] = selectedConcept?.concept?.uuid ?? ''
    }
    return updateBillableServiceDto;
  }
  function holderFunction() {
    return;
  }
  function handleSelectBillableServiceType(selectedBillServiceType: ServiceType | null | undefined) {
    if (selectedBillServiceType) {
      setServiceType(selectedBillServiceType);
    } else {
      setServiceType(null);
    }
  }
  function handleAddServicePriceControl() {
    const newServicePrices = [
      ...selectedServicePrices,
      {
        name: selectedPaymentMode?.name ?? '',
        paymentMode: selectedPaymentMode ?? '',
        price: selectedPrice ?? 0,
      },
    ];
    setSelectedServicePrices(newServicePrices);
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
  function handleRemoveSp(i: number){
     const newSelectedServicePrices = selectedServicePrices.filter((s,index)=>{
         return index !== i;
     });
     setSelectedServicePrices(newSelectedServicePrices);
  }
  async function getAssociatedConcepts(){
    if(searchTerm && searchTerm.length > 3){
       const resp = await conceptSearch(searchTerm);
       if(resp){
           setConceptResults(resp);
       }
    }  
  }
  function handleConceptSelect(selectedConcept: Concept){
      setSearchTerm('');
      setSelectedConcept(selectedConcept);
      setConceptResults([]);
  }
  function handleConceptClear(){
    setSearchTerm('');
    setSelectedConcept(null);
  }
  function isValidUpdateBillableServiceDto(updateBillableServiceDto: UpdateBillableServiceDto): boolean{
    if(!updateBillableServiceDto.location){
        showSnackbar({
          kind: 'error',
          title: 'Missing location',
          subtitle: 'Billable service location not set',
        });
        return false;
    }
    if(!updateBillableServiceDto.name){
      showSnackbar({
          kind: 'error',
          title: 'Missing Billable service name',
          subtitle: 'Billable service name not set',
        });
        return false;
    }
    if(!updateBillableServiceDto.shortName){
      showSnackbar({
          kind: 'error',
          title: 'Missing Billable service short name',
          subtitle: 'Billable service short name not set',
        });
        return false;
    }
    if(!updateBillableServiceDto.servicePrices){
        showSnackbar({
            kind: 'error',
            title: 'Missing Billable service prices',
            subtitle: 'Billable service prices not set',
        });
         return false;
    }
    if(updateBillableServiceDto.servicePrices && updateBillableServiceDto.servicePrices.length === 0){
        showSnackbar({
            kind: 'error',
            title: 'Missing Billable service prices',
            subtitle: 'Billable service prices not set',
        });
         return false;
    }
    if(!updateBillableServiceDto.serviceType){
      showSnackbar({
            kind: 'error',
            title: 'Missing Billable service type',
            subtitle: 'Billable service type not set',
        });
       return false;
    }
    return true;
  }
  return (
    <>
      <Modal
        modalHeading="Edit Billable Service"
        open={open}
        size="md"
        onSecondarySubmit={onClose}
        onRequestClose={onClose}
        onRequestSubmit={loading ? holderFunction : handleAddBillableServiceItem}
        primaryButtonText={loading ? 'Editing...' : 'Save'}
        secondaryButtonText="Close"
      >
        <ModalBody>
          <div className={styles.EditBillableServiceModalLayout}>
            <div className={styles.formRow}>
              <TextInput 
              id="billable-service-name" 
              labelText="Name"  
              onChange={(e)=>setName(e?.target.value)}
              value={name}
              />
            </div>
            <div className={styles.formRow}>
              <TextInput 
              id="billable-service-short-name" 
              labelText="Short Name"  
              onChange={(e)=>setShortName(e?.target.value)}
              value={shortName}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.fullW}>
                <ComboBox
                  id={`billable-service`}
                  titleText={`Service Type`}
                  placeholder="Service Type"
                  items={billableServiceTypes ?? []}
                  itemToString={(item) => item?.display ?? ''}
                  onChange={({ selectedItem }) => handleSelectBillableServiceType(selectedItem)}
                />
              </div>
            </div>
             <div className={styles.formRow}>
               <div className={styles.conceptSearch}>
                <TextInput 
                id="conceptsSearch" 
                labelText='Associated concept' 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                 placeholder='Search associated concept'
                 value={selectedConcept?.concept?.display ?? searchTerm}
                />
                {
                conceptResults && conceptResults.length > 0 ? (<>
                <div className={styles.fullW}>
                    <ul className={styles.conceptsList}>
                    {conceptResults?.map((searchResult) => (
                      <li
                        className={styles.service}
                        key={searchResult.concept.uuid}
                        onClick={()=>handleConceptSelect(searchResult)}
                        role="menuitem">
                        {searchResult.display}
                      </li>
                    ))}
                  </ul>

                  </div>
                
                </>): (<></>)
               
                
              }
              </div>
              <div className={styles.conceptClearAction}>
                 <Button kind='secondary' onClick={handleConceptClear}>Clear</Button>
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
                <TextInput id="price" labelText="Price" onChange={handlePriceChange}  type='number'/>
              </div>
              <div className={styles.addSp}>
                <Button kind="primary" onClick={handleAddServicePriceControl}>
                  Add
                </Button>
              </div>
            </div>
            {selectedServicePrices && selectedServicePrices.length > 0 ? (
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
                    {selectedServicePrices.map((sp, index) => {
                      return (
                        <>
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{sp?.paymentMode?.name ?? ''}</TableCell>
                            <TableCell>{sp?.price ?? ''}</TableCell>
                            <TableCell>
                              <Button kind='ghost' onClick={()=>handleRemoveSp(index)}>
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
export default EditBillableServiceModal;
