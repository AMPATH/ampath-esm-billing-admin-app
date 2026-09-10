import React, { useEffect, useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TextInput } from '@carbon/react';
import { type BillableDrug } from '../types';
import styles from './billable-drugs-list.scss';

interface billableDrugsProps {
  billableDrugs: BillableDrug[];
}
const BillableDrugsList: React.FC<billableDrugsProps> = ({ billableDrugs }) => {
  const [searchTerm,setSearchTerm] = useState<string>('');
  const filteredDrugList = useMemo(()=> filterBillableDrugs(searchTerm),[searchTerm,billableDrugs]);
  if (!billableDrugs || billableDrugs.length === 0) {
    return <>No Billable Drugs</>;
  }
  function filterBillableDrugs(searchString: string): BillableDrug[]{
      if(!searchString){
             return billableDrugs;
      }
      return billableDrugs.filter((bd)=>{
          return bd?.name.toLowerCase().trim().includes(searchString.toLowerCase().trim())
      });
  }
  return (
    <>
    <div className={styles.listLayout}>
     <div className={styles.listHeader}>
        <div className={styles.listSearch}>
            <TextInput
                id="drug-search-name"
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
            <TableHeader>Drug</TableHeader>
            <TableHeader>Location</TableHeader>
            <TableHeader>Prices</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          { filteredDrugList.map((bd, index) => {
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

export default BillableDrugsList;
