import { DefaultFetch } from './DefaultFetch';
import { FetchOptions } from './AbstractFetch';

export interface SpringBootError {
  error: string;
  message: string;
  timestamp: string;
  status: number;
  exception: string;
  path: string;
}

export class SpringBootFetch extends DefaultFetch {
  constructor(fetchOptions: FetchOptions) {
    const { rootUrl, reqInit } = fetchOptions;
    const headers = {
      'Content-Type': 'application/json',
    };
    const req: RequestInit = {
      method: 'POST',
      mode: 'cors',
      headers,
      credentials: 'include',
      ...reqInit,
    };
    super({
      rootUrl,
      reqInit: req,
    });
  }

  fetch(uri: string, req?: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) =>
      super.fetch(uri, req).then(res => {
        if (res.ok) resolve(res);
        else {
          console.error(res);
          res.json().then((error: SpringBootError) => {
            console.error(error);
            reject(error.message);
          });
        }
      }),
    );
  }
}
