/**
 * 获取系统设置
 * */
import { request } from '@/utils/http/interface';
import http from '@/utils/http';
import host from '@/utils/http/HOST';

// @ts-ignore
export function getSystem(): request.PageRes<{
  title: string;
  url: string;
  keywords: string;
  description: string;
  email: string;
  start: string;
  qq: string;
}> {
  return http.get(`${host}/system`);
}

/**
 * 修改系统设置参数
 * @param data
 */
export function postSystem(data: {
  title?: string;
  url?: string;
  keywords?: string;
  description?: string;
  email?: string;
  start?: string;
  qq?: string;
}): request.PageRes<string> {
  return http.post(`${host}/system`, data);
}
