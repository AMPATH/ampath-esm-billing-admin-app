import React, { useEffect, useState } from "react";
import styles from './billable-services.root.scss';
import { Button } from "@carbon/react";
import { useSession } from "@openmrs/esm-framework";
import { fetchBillableServices } from "../resources/billable-services.resource";
import { type BillableService } from "../shared/types";
import BillableServicesList from "./list/billable-services-list";
const BillableServicesRoot: React.FC = ()=>{
    const [billableServices,setBillableServices] = useState<BillableService[]>([]);
    const session = useSession();
    const location = session.sessionLocation;
    const locationUuid = location?.uuid ?? '';
    useEffect(()=>{
        if(locationUuid){
            getBillableServices();
        }
    },[locationUuid]);
    async function getBillableServices(){
        const resp = await fetchBillableServices(location?.uuid ?? '');
        if(resp){
           setBillableServices(resp);
        }
        console.log({resp});
    }
   return <>
   <div className={styles.bsContainer}>
     <div className={styles.bsHeader}>
        <div className={styles.bsTitle}>
            <h5>Facility Billable Services</h5>
        </div>
        <div className={styles.bsAction}>
            <Button>+ Add new Service</Button>
        </div>
     </div>
     <div className={styles.bsContent}>
          {
            billableServices && billableServices.length > 0 ? (<>
            <BillableServicesList billableServices={billableServices} />
            </>) : (<></>)
          }
           
     </div>
   </div>
   </>
}
export default BillableServicesRoot;