import { HttpClient } from '@/infra/http'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

export class FacebookApi {
  baseUrl: string = 'https://graph.facebook.com'

  constructor (
    private readonly httpClient: HttpClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        clientId: this.clientId,
        clientSecret: this.clientSecret
      }
    })
  }
}
