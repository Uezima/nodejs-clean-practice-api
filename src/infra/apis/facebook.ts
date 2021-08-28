import { HttpClient } from '@/infra/http'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

export class FacebookApi {
  private readonly baseUrl: string = 'https://graph.facebook.com'
  private readonly grantType: string = 'client_credentials'

  constructor (
    private readonly httpClient: HttpClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    const token = await this.httpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: this.grantType
      }
    })

    if (token !== undefined) {
      await this.httpClient.get({
        url: `${this.baseUrl}/debug_token`,
        params: {
          access_token: token.access_token,
          input_token: params.token
        }
      })
    }
  }
}
