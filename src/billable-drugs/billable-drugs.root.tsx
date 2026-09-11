import React, { useEffect, useState } from "react";
import { useSession } from "@openmrs/esm-framework";
import styles from './billable-drugs.root.scss';
import { Button, InlineLoading } from "@carbon/react";
import BillableDrugsList from "./list/billable-drugs-list";
import { type BillableDrug } from "./types";
import CreateBillableDrugModal from "./modal/create-billable-drug/create-billable-drug.modal";
import { fetchBillableDrugs } from "../resources/billable-drug.resource";
const BillableDrugsRoot: React.FC = ()=>{
    const session = useSession();
    const location = session?.sessionLocation;
    const locationUuid = location?.uuid ?? '';
    const [showCreateBillableDrugModal,setShowCreateBillableDrugeModal] = useState<boolean>(false);
    const [billableDrugs,setBillableDrugs] = useState<BillableDrug[]>([]);
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
            if(locationUuid){
                getBillableDrugs();
            }
    },[locationUuid]);
    if(loading){
       return <InlineLoading  description='Loading...please wait'/>
    }
    async function getBillableDrugs(){
           setLoading(true);
            const resp = await fetchBillableDrugs(location?.uuid ?? '');
            if(resp){
               setBillableDrugs(resp);
            }
            setLoading(false);
    }
    function handleShowAddBillableDrugeModal(){
      setShowCreateBillableDrugeModal(true);
    }
    function handleCreateBillableDrug(){
      setShowCreateBillableDrugeModal(false);
      refresh();
    }
    function handleCloseBillableDrugModal(){
      setShowCreateBillableDrugeModal(false);
      refresh();
    }
    function refresh(){
      getBillableDrugs();
    }
   return <>
   <div className={styles.bdLayout}>
        <div className={styles.bdHeader}>
            <div className={styles.bdTittle}>
               <h4>Billable Drugs</h4>
            </div>
            <div className={styles.bdAction}>
             <Button onClick={handleShowAddBillableDrugeModal}>+ Add new Billable Drug</Button>
             <Button onClick={refresh} kind="tertiary">Refresh</Button>
            </div>
        </div>
        <div className={styles.bdContent}>
         <BillableDrugsList billableDrugs={billableDrugs} locationUuid={locationUuid} onRefresh={refresh}/>
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