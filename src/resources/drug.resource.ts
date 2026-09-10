import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import { type DrugReponse } from "../shared/types";

export async function drugSearch(searchTerm: string){
    const url = `${restBaseUrl}/drug?q=${searchTerm}&v=full`;
    const response = await openmrsFetch(url);
    const data = (await response.json()) as DrugReponse;
    return data.results ?? [];
}