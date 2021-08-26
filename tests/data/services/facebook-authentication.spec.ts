import { AuthenticationError } from '@/domain/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/data/contracts/crypto'
import { FacebookAuthenticationService } from '@/data/services/'
import { LoadUserAccountRepository, SaveFacebookUserAccountRepository } from '@/data/contracts/repos'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

import { mocked } from 'ts-jest/utils'
import { mock, MockProxy } from 'jest-mock-extended'

/*
type SutTypes = {
  sut: FacebookAuthenticationService
  loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
}
const makeSut = (): SutTypes => {
  const loadFacebookUserApi = mock<LoadFacebookUserApi>()
  const sut = new FacebookAuthenticationService(loadFacebookUserApi)
  return {
    sut,
    loadFacebookUserApi
  }
}
*/

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationService', () => {
  let tokenGenerator: MockProxy<TokenGenerator>
  let saveFacebookUserAccountRepository: MockProxy<SaveFacebookUserAccountRepository>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    tokenGenerator = mock<TokenGenerator>()
    saveFacebookUserAccountRepository = mock<SaveFacebookUserAccountRepository>()
    loadUserAccountRepository = mock<LoadUserAccountRepository>()
    loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    saveFacebookUserAccountRepository.saveWithFacebook.mockResolvedValue({
      id: 'any_account_id'
    })
    tokenGenerator.generate.mockResolvedValue('any_generated_token')
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepository, saveFacebookUserAccountRepository, tokenGenerator)
  })

  it('should call LoadFacebookUserApi with correct parameters', async () => {
    /*
    const loadFacebookUserApi = {
      loadUser: jest.fn()
    }
    const { sut, loadFacebookUserApi } = makeSut()
    */
    await sut.exec({ token })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.exec({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async () => {
    await sut.exec({ token })

    expect(loadUserAccountRepository.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should create account with facebook data', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => {
      return { any: 'any' }
    })
    mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)

    await sut.exec({ token })

    expect(saveFacebookUserAccountRepository.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(saveFacebookUserAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)

    await sut.exec({ token })

    expect(tokenGenerator.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(tokenGenerator.generate).toHaveBeenCalledTimes(1)
  })

  it('should return an AccessToken on success', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)

    const resultSut = await sut.exec({ token })

    expect(resultSut).toEqual(new AccessToken('any_generated_token'))
  })

  it('should rethrow if LoadFacebookUserApi throws', async () => {
    loadFacebookUserApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut.exec({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('should rethrow if LoadUserAccountRepository throws', async () => {
    loadUserAccountRepository.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut.exec({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if SaveFacebookUserAccountRepository throws', async () => {
    saveFacebookUserAccountRepository.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut.exec({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if TokenGenerator throws', async () => {
    tokenGenerator.generate.mockRejectedValueOnce(new Error('generate_error'))

    const promise = sut.exec({ token })

    await expect(promise).rejects.toThrow(new Error('generate_error'))
  })
})
