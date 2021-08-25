import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services/'
import { LoadUserAccountRepository, CreateFacebookUserAccountRepository, UpdateFacebookUserAccountRepository } from '@/data/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'
import { LoadFacebookUserApi } from '@/data/contracts/apis'

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

describe('FacebookAuthenticationService', () => {
  let updateFacebookUserAccountRepository: MockProxy<UpdateFacebookUserAccountRepository>
  let createFacebookUserAccountRepository: MockProxy<CreateFacebookUserAccountRepository>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    updateFacebookUserAccountRepository = mock<UpdateFacebookUserAccountRepository>()
    createFacebookUserAccountRepository = mock<CreateFacebookUserAccountRepository>()
    loadUserAccountRepository = mock<LoadUserAccountRepository>()
    loadFacebookUserApi = mock<LoadFacebookUserApi>()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    sut = new FacebookAuthenticationService(loadFacebookUserApi, loadUserAccountRepository, createFacebookUserAccountRepository, updateFacebookUserAccountRepository)
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

  it('should call CreateFacebookAccountRepository when LoadUserAccountRepository does not return data', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce(undefined)

    await sut.exec({ token })

    expect(createFacebookUserAccountRepository.createFromFacebook).toHaveBeenCalledWith({ name: 'any_fb_name', email: 'any_fb_email', facebookId: 'any_fb_id' })
    expect(createFacebookUserAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateFacebookAccountRepository when LoadUserAccountRepository returns data', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.exec({ token })

    expect(updateFacebookUserAccountRepository.updateFromFacebook).toHaveBeenCalledWith({ id: 'any_id', facebookId: 'any_fb_id', name: 'any_name' })
    expect(updateFacebookUserAccountRepository.updateFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update account name', async () => {
    loadUserAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id'
    })

    await sut.exec({ token })

    expect(updateFacebookUserAccountRepository.updateFromFacebook).toHaveBeenCalledWith({ id: 'any_id', facebookId: 'any_fb_id', name: 'any_fb_name' })
    expect(updateFacebookUserAccountRepository.updateFromFacebook).toHaveBeenCalledTimes(1)
  })
})
