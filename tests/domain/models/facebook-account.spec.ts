import { FacebookAccount } from '@/domain/models'

describe('FacebookAccount', () => {
  it('should create with Facebook data only', () => {
    const sut = new FacebookAccount({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    expect(sut).toEqual({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })

  it('should update name if it is empty', () => {
    const sut = new FacebookAccount({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    expect(sut.name).toEqual('any_fb_name')
  })

  it('should not update name if its not empty', () => {
    const sut = new FacebookAccount({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    }, {
      id: 'any_id',
      name: 'any_name'
    })

    expect(sut.name).toEqual('any_name')
  })
})
