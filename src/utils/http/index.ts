import axios, { AxiosRequestConfig } from 'axios';
import { request } from '@/utils/http/interface';

const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzA2MTk1ODEsImlhdCI6MTU3MDYxNTk4MSwidXNlcl9pZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiIGUxMGFkYzM5NDliYTU5YWJiZTU2ZTA1N2YyMGY4ODNlIn0.BaPxVSyedvyDQkkjmmkhJS82W9cComjZcsT4y4vI5ig'

axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
  config.headers['Content-Type'] = 'application/json';

  if (config.url && (config.url).indexOf('/auth/verify') > -1) {
      config.headers.token = t
  }
  return config;
});

axios.interceptors.response.use(async (res) => res);

// @ts-ignore
export function get<T>(req: string, config: any = {}): Promise<request.ParseResult> {
  return axios.get(req, config);
}

// @ts-ignore
export function post<T>(req: string, params: any, config?: any): Promise<request.ParseResult> {
  return axios.post(req, params, config);
}

const http = {
  get,
  post,
};

export default http;
