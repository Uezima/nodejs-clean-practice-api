import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, SaveFacebookUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly saveFacebookUserAccountRepository: SaveFacebookUserAccountRepository
  ) {}

  async exec (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbUser = await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
    if (fbUser !== undefined) {
      const accountData = await this.loadUserAccountRepository.load({ email: fbUser.email })
      const fbAccount = new FacebookAccount(fbUser, accountData)
      await this.saveFacebookUserAccountRepository.saveWithFacebook(fbAccount)
    }
    return new AuthenticationError()
  }
}
