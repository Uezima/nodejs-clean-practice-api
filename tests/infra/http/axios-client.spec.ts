import { HttpClient } from '@/infra/http'

import axios from 'axios'

jest.mock('axios')

class AxiosHttpClient {
  async get (params: HttpClient.Params): Promise<any> {
    await axios.get(params.url, { params: params.params })
  }
}

describe('AxiosHttpClient', () => {
  describe('get', () => {
    it('should call axios with correct parameteres', async () => {
      const fakeAxios = axios as jest.Mocked<typeof axios>
      const sut = new AxiosHttpClient()

      await sut.get({
        url: 'any_url',
        params: {
          any_param: 'any_param'
        }
      })

      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', {
        params: {
          any_param: 'any_param'
        }
      })
    })
  })
})
