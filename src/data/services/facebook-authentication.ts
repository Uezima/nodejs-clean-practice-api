import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, SaveFacebookUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/data/contracts/crypto'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly saveFacebookUserAccountRepository: SaveFacebookUserAccountRepository,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async exec (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const fbUser = await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
    if (fbUser !== undefined) {
      const accountData = await this.loadUserAccountRepository.load({ email: fbUser.email })
      const fbAccount = new FacebookAccount(fbUser, accountData)
      const { id } = await this.saveFacebookUserAccountRepository.saveWithFacebook(fbAccount)
      const token = await this.tokenGenerator.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
      return new AccessToken(token)
    }
    return new AuthenticationError()
  }
}
