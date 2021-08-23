import { AuthenticationError } from '@/domain/errors'
import { AccessToken } from '@/domain/models'

export interface FacebookAuthentication {
  exec: (params: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
