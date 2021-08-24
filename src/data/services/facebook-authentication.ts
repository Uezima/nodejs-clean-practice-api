import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthentication } from '@/domain/features'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository
  ) {}

  async exec (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbUser = await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
    if (fbUser !== undefined) {
      await this.loadUserAccountRepository.load({ email: fbUser.email })
    }
    return new AuthenticationError()
  }
}
