import { request } from '@/utils/http/interface';
import http from '@/utils/http';
import host from '@/utils/http/HOST';
import { ArticleFollow } from "@/pages/ArticleList/interface";

// @ts-ignore
export function getArticleList(params: ArticleFollow.ArticleList): request.PageResLimit<any> {
  console.log(params);
  return http.get(`${host}/articleList/get`, { params: { ...params } });
}

