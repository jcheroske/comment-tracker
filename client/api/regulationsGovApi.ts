import { AxiosInstance } from 'axios'

export interface IRegulationsGovApi {
  getDockets(filters: Filters): Promise<any>
  getDocuments(filters: Filters): Promise<any>
  getComments(filters: Filters): Promise<any>
  getDocket(id: string): Promise<any>
  getDocument(id: string): Promise<any>
  getComment(id: string): Promise<any>
}

export type Filters = {
  [filterName: string]: string | number | boolean
}

export const createApi = ($axios: AxiosInstance): IRegulationsGovApi => ({
  getDockets(filters: Filters): Promise<Array<any>> {
    return getObjectsByFilters('/dockets', filters, $axios)
  },
  getDocuments(filters: Filters): Promise<Array<any>> {
    return getObjectsByFilters('/documents', filters, $axios)
  },
  getComments(filters: Filters): Promise<Array<any>> {
    return getObjectsByFilters('/comments', filters, $axios)
  },

  getDocket(id: string): Promise<any> {
    return getObjectById('/dockets/:id', id, $axios)
  },
  getDocument(id: string): Promise<any> {
    return getObjectById('/documents/:id', id, $axios)
  },
  getComment(id: string): Promise<any> {
    return getObjectById('/comments/:id', id, $axios)
  },
})

async function getObjectsByFilters(
  uri: string,
  filters: Filters,
  axios: AxiosInstance
): Promise<any> {
  const res = await axios.get(uri, { params: filters })
  return res.data.data
}

async function getObjectById(
  uri: string,
  id: string,
  axios: AxiosInstance
): Promise<any> {
  const res = await axios.get(uri, { params: { id } })
  return res.data.data
}
