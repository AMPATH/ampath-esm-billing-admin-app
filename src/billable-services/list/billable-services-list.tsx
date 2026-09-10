import React, { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextInput } from '@carbon/react';
import { type BillableService } from '../../shared/types';
import styles from './billable-services-list.scss';
interface billableServiceProps {
  billableServices: BillableService[];
}
const BillableServicesList: React.FC<billableServiceProps> = ({ billableServices }) => {
  const [searchTerm,setSearchTerm] = useState<string>('');
  const filteredBillableServicesList = useMemo(()=> filterBillableServices(searchTerm),[searchTerm,billableServices]);
  if (!billableServices || billableServices.length === 0) {
    return <>No Billable service</>;
  }
   function filterBillableServices(searchString: string): BillableService[]{
        if(!searchString){
               return billableServices;
        }
        return billableServices.filter((bs)=>{
            return bs?.display?.toLowerCase().trim().includes(searchString.toLowerCase().trim())
        });
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
                  </TableRow>
                </>
              );
            })}
        </TableBody>
      </Table>
      </div>
      </div>
      </div>
    </>
  );
};

export default BillableServicesList;
