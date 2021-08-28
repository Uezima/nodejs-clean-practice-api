import { FacebookApi } from '@/infra/apis'
import { HttpClient } from '@/infra/http'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let sut: FacebookApi
  let httpClient: MockProxy<HttpClient>
  const clientId = 'any_client_id'
  const clientSecret = 'any_client_secret'

  beforeAll(() => {
    httpClient = mock()
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('should get a new app token', async () => {
    await sut.loadUser({ token: 'any_token' })

    expect(httpClient.get).toHaveBeenCalledTimes(1)
    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        clientId: 'any_client_id',
        clientSecret: 'any_client_secret'
      }
    })
  })
})

// https://graph.facebook.com/oauth/access_token
