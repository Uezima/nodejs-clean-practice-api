export interface HttpClient {
  get: (params: HttpClient.Params) => Promise<HttpClient.Result>
}

namespace HttpClient {
  export type Params = {
    url: string
    params: object
  }

  export type Result = {
    response: string
  }
}
