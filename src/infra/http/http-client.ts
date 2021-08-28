export interface HttpClient {
  get: (params: HttpClient.Params) => Promise<HttpClient.Result>
}

export namespace HttpClient {
  export type Params = {
    url: string
    params: object
  }

  export type Result = any
}
