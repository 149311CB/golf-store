import https from "https";
import { URLSearchParams } from "url";

function get(
  endpoint: string,
  path: string,
  params?: any,
  headers?: any
): Promise<any> {
  let query = "";
  if (params) {
    query = new URLSearchParams(params).toString();
  }
  const option: https.RequestOptions = {
    hostname: endpoint,
    path: path + "?" + query,
    port: 443,
    headers,
  };
  let resData = "";
  return new Promise((resolve, reject) => {
    const request = https.request(option, (response) => {
      response.on("data", (chunk) => {
        resData += chunk;
      });
      response.on("end", () => {
        const result = JSON.parse(resData);
        resolve(result);
      });
    });
    request.on("error", (err) => {
      reject(err);
    });
    request.end();
  });
}

function post(endpoint: string, path: string, headers?: any, body?: any) {
  const data = JSON.stringify(body);
  const option: https.RequestOptions = {
    hostname: endpoint,
    path,
    port: 443,
    method: "POST",
    headers: {
      ...headers,
      ...{
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    },
  };
  return new Promise((resolve, reject) => {
    https
      .request(option, (response) => {
        let resData = "";
        response.on("data", (chunk) => {
          resData += chunk;
        });
        response.on("end", () => {
          const result = JSON.parse(resData);
          resolve(result);
        });
      })
      .on("error", (err) => {
        reject(err);
      })
      .write(data);
  });
}

export const httpHelper = {
  get,
  post,
};
