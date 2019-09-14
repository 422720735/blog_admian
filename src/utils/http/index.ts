import axios from 'axios';
import { request } from '@/utils/http/interface';
axios.interceptors.request.use(async config => {
  config.headers['Content-Type'] = 'application/json';
  return config;
});

axios.interceptors.response.use(async (response: request.ParseResult<any>) => {
  return response;
});

// @ts-ignore
export function get<T>(request: string, config: any = {}): Promise<request.ParseResult> {
  return axios.get(request, config);
}

// @ts-ignore
export function post<T>(request: string, params: any, config?: any): Promise<request.ParseResult> {
  return axios.post(request, params, config);
}

const http = {
  get,
  post,
};
export default http;
