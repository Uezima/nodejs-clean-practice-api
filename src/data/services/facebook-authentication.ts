import { LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthentication } from '@/domain/features'
import { CreateFacebookUserAccountRepository, LoadUserAccountRepository, UpdateFacebookUserAccountRepository } from '@/data/contracts/repos'
import { AuthenticationError } from '@/domain/errors'

export class FacebookAuthenticationService {
  constructor (
    private readonly loadFacebookUserByTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepository: LoadUserAccountRepository,
    private readonly createFacebookUserAccountRepository: CreateFacebookUserAccountRepository,
    private readonly updateFacebookUserAccountRepository: UpdateFacebookUserAccountRepository
  ) {}

  async exec (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbUser = await this.loadFacebookUserByTokenApi.loadUser({ token: params.token })
    if (fbUser !== undefined) {
      const accountData = await this.loadUserAccountRepository.load({ email: fbUser.email })

      if (accountData?.name !== undefined) {
        await this.updateFacebookUserAccountRepository.updateFromFacebook({ id: accountData.id, name: accountData.name, facebookId: fbUser.facebookId })
      } else {
        await this.createFacebookUserAccountRepository.createFromFacebook(fbUser)
      }
    }
    return new AuthenticationError()
  }
}
