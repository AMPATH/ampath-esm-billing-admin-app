import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@carbon/react';
import { type BillableService } from '../../shared/types';

interface billableServiceProps {
  billableServices: BillableService[];
}
const BillableServicesList: React.FC<billableServiceProps> = ({ billableServices }) => {
  if (!billableServices || billableServices.length === 0) {
    return <>No Billable service</>;
  }
  return (
    <>
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
          {billableServices &&
            billableServices.map((bs, index) => {
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
    </>
  );
};

export default BillableServicesList;
