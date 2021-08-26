type FacebookData = {
  name: string
  email: string
  facebookId: string
}

type UserAccount = {
  id?: string
  name?: string
}

export class FacebookAccount {
  id?: string
  name: string
  email: string
  facebookId: string

  constructor (fbData: FacebookData, userAccount?: UserAccount) {
    this.id = userAccount?.id
    this.name = userAccount?.name ?? fbData.name
    this.email = fbData.email
    this.facebookId = fbData.facebookId
  }
}
