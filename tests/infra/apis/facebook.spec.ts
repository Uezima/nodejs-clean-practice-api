import { FacebookApi } from '@/infra/apis'
import { HttpClient } from '@/infra/http'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let sut: FacebookApi
  let httpClient: MockProxy<HttpClient>
  let clientId: string
  let clientSecret: string

  beforeAll(() => {
    httpClient = mock()
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
  })

  beforeEach(() => {
    httpClient.get.mockResolvedValueOnce({
      access_token: 'any_app_token'
    })

    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('should get a new app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: 'any_client_id',
        client_secret: 'any_client_secret',
        grant_type: 'client_credentials'
      }
    })
  })

  it('should get debug token in order to get user id', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })
})

// https://graph.facebook.com/oauth/access_token
