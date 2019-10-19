import { request } from '@/utils/http/interface';
import http from '@/utils/http';
import host from '@/utils/http/HOST';
import { ArticleFollow } from '@/pages/ArticleList/interface';

// @ts-ignore
export function getArticleList(
  params: ArticleFollow.ArticleListQuery,
): request.PageRes<{
  current: number;
  count: number;
  pageSize: number;
  total: number;
  data: ArticleFollow.ArticleList[];
}> {
  return http.get(`${host}/articleList/get`, { params: { ...params } });
}

export function fetchIsTop(params: ArticleFollow.UpdateIstop) {
  return http.post(`${host}/article/isTop/update`, params);
}

export function fetchDelInfo(id: number) {
  return http.post(`${host}/article/list/del`, { id });
}
