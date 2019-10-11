import http from '@/utils/http';
import host from '@/utils/http/HOST';
import { request } from '@/utils/http/interface';

// @ts-ignore
export function uploadFormData(params: FormData): request.PageRes<string> {
  return http.post(`${host}/article/info`, params);
}
