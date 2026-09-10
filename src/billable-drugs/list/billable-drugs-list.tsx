import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@carbon/react';
import { type BillableDrug } from '../types';

interface billableDrugsProps {
  billableDrugs: BillableDrug[];
}
const BillableDrugsList: React.FC<billableDrugsProps> = ({ billableDrugs }) => {
  console.log(billableDrugs)
  if (!billableDrugs || billableDrugs.length === 0) {
    return <>No Billable Drugs</>;
  }
  return (
    <>
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
          { billableDrugs.map((bd, index) => {
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
    </>
  );
};

export default BillableDrugsList;
