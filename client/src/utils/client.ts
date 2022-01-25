import pkg from "../../package.json";

export interface IResponsePayload {
  data: any;
  headers?: Headers;
  ok?: boolean;
  redirected?: boolean;
  status?: number;
  statusText?: string;
  url?: string;
}

export async function client(
  endpoint: string,
  { body, ...customConfig }: RequestInit = {}
): Promise<IResponsePayload> {
  const headers = { "Content-Type": "application/json" };

  if (pkg.proxy
    && !endpoint.includes(pkg.proxy)
    && !endpoint.includes("http")) {
    endpoint = `${pkg.proxy}${endpoint}`;
  }

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let result = { data: null } as IResponsePayload;
  try {
    const response: Response = await window.fetch(endpoint, config);
    const data = await response.json();
    result = {
      data: data,
      headers: response.headers,
      ok: response.ok,
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    } as IResponsePayload;
  } catch (err) {
    if (err instanceof Error) {
      return Promise.reject(err.message ? err.message : result);
    }
  }
  return Promise.resolve(result);
}

client.get = function(endpoint: string, customConfig: RequestInit = {}) {
  return client(endpoint, { ...customConfig, method: "GET" });
};

client.post = function(endpoint: string, body: any, customConfig: RequestInit = {}) {
  return client(endpoint, { ...{ body: body }, ...customConfig });
};
