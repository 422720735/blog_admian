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

  interface PageLimit<T> {
    /**
     * 总条数
     */
    readonly total: number;
    /**
     * 当前页
     * */
    readonly current: number;
    /**
     * 每页显示的条数
     */
    readonly pageSize: number;
    /**
     * 当前页返回的实际条数
     */
    readonly num: number;
    /**
     * 返回的数据
     */
    readonly data: T;
  }

  /**
   * 没有分页的数据返回接口
   */
  type PageRes<T> = Promise<ParseResult<T>>;
  /**
   * 分页接口
   */
  type PageResLimit<T> = Promise<ParseResult<PageLimit<T>>>;
}
