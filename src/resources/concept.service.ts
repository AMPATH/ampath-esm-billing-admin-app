import { openmrsFetch, restBaseUrl } from "@openmrs/esm-framework";
import { type ConceptSearchResponse } from "../shared/types";

export async function conceptSearch(searchTerm: string){
    const url = `${restBaseUrl}/conceptsearch?q=${searchTerm}`;
    const response = await openmrsFetch(url);
    const data = (await response.json()) as ConceptSearchResponse;
    return data.results ?? [];
}