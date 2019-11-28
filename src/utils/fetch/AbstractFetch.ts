export interface FetchOptions {
  rootUrl: string;
  reqInit?: RequestInit;
}
export abstract class AbstractFetch {
  protected constructor(public fetchOptions: FetchOptions) {}

  /**
   * url = rootUrl + uri
   * @param uri
   * @param init
   */
  abstract fetch(uri: string, init?: RequestInit): Promise<Response>;
  post(uri: string, data: object): Promise<any> {
    return this.fetch(uri, { body: JSON.stringify(data) }).then(res => res.json());
  }
}
