import { AbstractFetch, FetchOptions } from './AbstractFetch';

export class DefaultFetch extends AbstractFetch {
  constructor(fetchOptions: FetchOptions) {
    super(fetchOptions);
  }

  fetch(uri: string, req?: RequestInit): Promise<Response> {
    const { rootUrl, reqInit } = this.fetchOptions;
    return fetch(rootUrl + uri, { ...reqInit, ...req });
  }
}
