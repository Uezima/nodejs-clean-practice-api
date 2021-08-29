import { HttpClient } from '@/infra/http'

import axios, { AxiosStatic } from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get (params: HttpClient.Params): Promise<any> {
    await axios.get(params.url, { params: params.params })
  }
}

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: AxiosStatic
  let url: string
  let params: object

  beforeAll(() => {
    url = 'any_url'
    params = {
      any: 'any'
    }
    fakeAxios = axios as jest.Mocked<typeof axios>
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  describe('get', () => {
    it('should call axios with correct parameteres', async () => {
      await sut.get({ url: 'any_url', params })

      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
    })
  })
})
