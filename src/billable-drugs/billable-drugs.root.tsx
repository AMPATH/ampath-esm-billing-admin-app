import React, { useEffect, useState } from "react";
import { useSession } from "@openmrs/esm-framework";
import styles from './billable-drugs.root.scss';
import { Button } from "@carbon/react";
import BillableDrugsList from "./list/billable-drugs-list";
import { type BillableDrug } from "./types";
import CreateBillableDrugModal from "./modal/create-billable-drug.modal";
import { fetchBillableDrugs } from "../resources/billable-drug.resource";
const BillableDrugsRoot: React.FC = ()=>{
    const session = useSession();
    const location = session?.sessionLocation;
    const locationUuid = location?.uuid ?? '';
    const [showCreateBillableDrugModal,setShowCreateBillableDrugeModal] = useState<boolean>(false);
    const [billableDrugs,setBillableDrugs] = useState<BillableDrug[]>([]);
    useEffect(()=>{
            if(locationUuid){
                getBillableDrugs();
            }
    },[locationUuid]);
    async function getBillableDrugs(){
            const resp = await fetchBillableDrugs(location?.uuid ?? '');
            if(resp){
               setBillableDrugs(resp);
            }
    }
    function handleShowAddBillableDrugeModal(){
      setShowCreateBillableDrugeModal(true);
    }
    function handleCreateBillableDrug(){
      setShowCreateBillableDrugeModal(false);
    }
    function handleCloseBillableDrugModal(){
      setShowCreateBillableDrugeModal(false);
    }
   return <>
   <div className={styles.bdLayout}>
        <div className={styles.bdHeader}>
            <div className={styles.bdTittle}>
               <h4>Billable Drugs</h4>
            </div>
            <div className={styles.bdAction}>
             <Button onClick={handleShowAddBillableDrugeModal}>+ Add new Billable Drug</Button>
            </div>
        </div>
        <div className={styles.bdContent}>
         <BillableDrugsList billableDrugs={billableDrugs}/>
        </div>
         {
            showCreateBillableDrugModal && locationUuid && <CreateBillableDrugModal
            locationUuid={locationUuid} 
            open={showCreateBillableDrugModal}
            onClose={handleCreateBillableDrug}
            onSuccess = {handleCloseBillableDrugModal}
        />
       }
   </div>
   
   </>
}
export default BillableDrugsRoot;