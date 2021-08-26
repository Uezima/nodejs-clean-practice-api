import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthentication } from '@/domain/features'
import { LoadUserAccountRepository, SaveFacebookUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/data/contracts/crypto'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly saveFacebookUserAccountRepository: SaveFacebookUserAccountRepository,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async exec (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbUser = await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
    if (fbUser !== undefined) {
      const accountData = await this.loadUserAccountRepository.load({ email: fbUser.email })
      const fbAccount = new FacebookAccount(fbUser, accountData)
      const { id } = await this.saveFacebookUserAccountRepository.saveWithFacebook(fbAccount)
      await this.tokenGenerator.generate({ key: id })
    }
    return new AuthenticationError()
  }
}
