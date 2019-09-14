import { request } from '@/utils/http/interface';
import http from '@/utils/http';
import host from '@/utils/http/HOST';

// @ts-ignore
export function getCategory(): request.PageRes<
  { id?: number; created?: number; updated?: number; name?: string }[]
> {
  return http.get(`${host}/tag`);
}

export function setCategory(params: {
  id?: number;
  name?: string;
  created?: number;
  updated?: number;
}): request.PageRes<string> {
  return http.post(`${host}/tag`, params);
}
