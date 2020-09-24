import { AxiosInstance } from 'axios'

export interface IRegulationsGov {
  getDocument(id: string): Promise<any>
  getComment(id: string): Promise<any>
}

export const createApi = ($axios: AxiosInstance): IRegulationsGov => ({
  getDocument(id: string): Promise<any> {
    return getObjectById('/documents/:id', id, $axios)
  },
  getComment(id: string): Promise<any> {
    return getObjectById('/comments/:id', id, $axios)
  },
})

async function getObjectById(
  uri: string,
  id: string,
  axios: AxiosInstance
): Promise<any> {
  const res = await axios.get(uri, { params: { id } })
  return res.data.data
}
