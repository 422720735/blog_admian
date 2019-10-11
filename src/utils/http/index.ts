import axios, { AxiosRequestConfig } from 'axios';
import { request } from '@/utils/http/interface';
import httpStatus from '@/utils/http/returnCode';
import router from 'umi/router';
import { message } from 'antd';
import { globalFixed } from '@/globallEnum/keyCommon';

axios.interceptors.request.use(async (config: AxiosRequestConfig) => {
  config.headers['Content-Type'] = 'application/json';
  if (config.url && (config.url).indexOf('/api/admin/login') === -1) {
      config.headers.token = sessionStorage.getItem(globalFixed.TOKEN_ID)
  }
  return config;
});

axios.interceptors.response.use(async (res: any) => {
  if (res.data.code === httpStatus.RESTRICT) {
    await message.error('请重新登陆，访问已到期！');
    await sessionStorage.removeItem(globalFixed.TOKEN_ID);
    await router.push('/user/login')
  }
  return res
});

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
