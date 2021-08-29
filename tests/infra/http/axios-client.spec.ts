import { HttpClient } from '@/infra/http'

import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get <T = any>(params: HttpClient.Params): Promise<T> {
    const result = await axios.get(params.url, { params: params.params })
    return result.data
  }
}

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object

  beforeAll(() => {
    url = 'any_url'
    params = {
      any: 'any'
    }
    fakeAxios = axios as jest.Mocked<typeof axios>
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
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

    it('should call axios with correct parameteres', async () => {
      const result = await sut.get({ url: 'any_url', params })

      expect(result).toEqual('any_data')
    })
  })
})
