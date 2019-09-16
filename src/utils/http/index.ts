import axios from 'axios';
import { request } from '@/utils/http/interface';

axios.interceptors.request.use(async config => {
  config.headers['Content-Type'] = 'application/json';
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
