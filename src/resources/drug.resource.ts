import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import { type HieProductCatalogueDrugsResponse, type DrugReponse } from "../shared/types";
import { HIE_PRODUCT_CATALOGUE_DRUGS_UUID } from "../shared/constants";

export async function drugSearch(searchTerm: string){
    const url = `${restBaseUrl}/drug?q=${searchTerm}&v=full`;
    const response = await openmrsFetch(url);
    const data = (await response.json()) as DrugReponse;
    return data.results ?? [];
}
export async function fetchDrugCatalogueSearch(){
    const url = `${restBaseUrl}/concept/${HIE_PRODUCT_CATALOGUE_DRUGS_UUID}?v=custom:(uuid,display,setMembers:(uuid,display))`;
    const response = await openmrsFetch(url);
    const data = (await response.json()) as HieProductCatalogueDrugsResponse;
    return data.setMembers ?? [];
}
export async function fetchAmpathOrderableDrugs(searchTerm: string){
    const url = `${restBaseUrl}/drug?s=ampathOrderableDrugs&q=${searchTerm}&v=full`;
    const response = await openmrsFetch(url);
    const data = (await response.json()) as DrugReponse;
    return data.results ?? [];
}