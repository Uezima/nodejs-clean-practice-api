import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthentication } from '@/domain/features'
import { CreateFacebookUserAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookUserAccountRepository: CreateFacebookUserAccountRepository
  ) {}

  async exec (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbUser = await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
    if (fbUser !== undefined) {
      await this.loadUserAccountRepository.load({ email: fbUser.email })
      await this.createFacebookUserAccountRepository.createFromFacebook(fbUser)
    }
    return new AuthenticationError()
  }
}
