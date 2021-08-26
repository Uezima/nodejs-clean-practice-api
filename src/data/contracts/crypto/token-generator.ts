import { AccessToken } from '@/domain/models'

namespace TokenGenerator {
  export type Params = {
    key: string
  }
}

export interface TokenGenerator {
  generate: (params: TokenGenerator.Params) => Promise<AccessToken>
}
