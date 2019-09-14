import { AxiosResponse } from 'axios';

declare namespace request {
  interface ServerResponse<T> {
    /**
     * 状态
     */
    readonly code: number;
    /**
     * 数据
     */
    readonly msg: T;
    /**
     * 返回时间
     */
    readonly time: number;
  }

  interface ParseResult<T> extends AxiosResponse<ServerResponse<T>> {}

  /**
   * 没有分页的数据返回接口
   */
  type PageRes<T> = Promise<ParseResult<T>>;
  /**
   * 分页接口
   */
  type PageResLimit<T> = Promise<ParseResult<T>>;
}
