import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationService } from '@/data/services/'
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
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAuthenticationService
  beforeEach(() => {
    loadFacebookUserApi = mock<LoadFacebookUserApi>()
    sut = new FacebookAuthenticationService(loadFacebookUserApi)
  })

  it('should call LoadFacebookUserApi with correct parameters', async () => {
    /*
    const loadFacebookUserApi = {
      loadUser: jest.fn()
    }
    const { sut, loadFacebookUserApi } = makeSut()
    */
    await sut.exec({ token: 'any_token' })

    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.exec({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
