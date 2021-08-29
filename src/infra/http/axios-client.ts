import { HttpClient } from '@/infra/http'

import axios from 'axios'

export class AxiosHttpClient {
  async get <T = any>(params: HttpClient.Params): Promise<T> {
    const result = await axios.get(params.url, { params: params.params })
    return result.data
  }
}
