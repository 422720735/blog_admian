import http from '@/utils/http';
import host from '@/utils/http/HOST';
import { request } from '@/utils/http/interface';
import { DetailsFollow } from '@/pages/Details/interface';

// @ts-ignore
export function uploadFormData(params: FormData): request.PageRes<string> {
  return http.post(`${host}/article/upload/img`, params);
}

export function insertArticleInfo(params: DetailsFollow.formSubmit) {
  return http.post(`${host}/article/info/add`, params)
}

export function getArticleInfo(id: number): request.PageRes<DetailsFollow.postInfoV> {
  const params = { id };
  return http.get(`${host}/article/info/get`, { params: { ...params } })
}
