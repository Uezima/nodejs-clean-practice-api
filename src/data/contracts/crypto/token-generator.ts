import { AccessToken } from '@/domain/models'

namespace TokenGenerator {
  export type Params = {
    key: string
    expirationInMs: number
  }
}

export interface TokenGenerator {
  generate: (params: TokenGenerator.Params) => Promise<AccessToken>
}
