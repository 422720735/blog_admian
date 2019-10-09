// import { request } from '@/utils/http/interface';
import http from '@/utils/http';
import host from '@/utils/http/HOST';

// @ts-ignore
export function handleLogin(params: { username: string; password: string;}) {
  return http.post(`${host.replace('/v2', '')}/login`, { ...params });
}

export function test() {
  return http.get(`${host}/auth/verify`)
}
