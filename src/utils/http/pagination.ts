/**
 * 分页参数
 */
export interface Params {
  current?: number;
  pageSize?: number;
  refresh?: boolean;
  loadMore?: boolean;
  [key: string]: any;
}

/**
 * 分页参数
 */
export interface Pagination {
  current: number;
  pageSize?: number;
  lastPage?: boolean;
  total?: number;
}

/**
 * 接口数据
 */
export interface PageResult<T> {
  data: T[];
  [key: string]: any;
}

/**
 * 分页数据格式
 */
export interface PageData<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * 默认参数
 */
export const DefaultParams: Params = {
  current: 1,
  pageSize: 10
};

/**
 * 默认数据
 */
export const DefaultPageData: PageData<any> = {
  data: [],
  pagination: { current: 1, pageSize: 10, lastPage: true }
};

/**
 * 合并查询参数
 */
export const mergeParams = (prevData: Params, currentData?: Params): Params => {
  if (currentData && currentData.loadMore) {
    currentData.current = prevData.current ? prevData.current + 1 : 1;
    delete currentData.loadMore;
  } else if (currentData && currentData.refresh) {
    currentData.current = 1;
    delete currentData.refresh;
  }
  return { ...prevData, ...currentData };
};

/**
 * @desc 整合分页列表中的数据
 * @desc 用于处理分页请求中的数据
 * @param prevData {Object} 整合之前的数据
 * @param currentData {Object} 当前引入的数据
 * @return {Object} 整合之后的数据
 */
export const mergePagination = (prevData: PageData<any>, currentData: any): PageData<any> => {
  if (!prevData || !prevData.data) {
    throw new Error('prevData传入的数据格式错误，请确保格式正确。');
  }

  // currentData数据格式为接口返回数据，否则可能会使用异常
  // 需要确保格式  response = { data: [], current: 0, pageCount: 2, lastPage: false }
  if (!currentData) {
    throw new Error('currentData传入的数据格式错误，请确保格式正确。');
  }

  const pageSize = currentData.pageSize || prevData.pagination.pageSize || 10;

  if (currentData.current === 1) {
    return {
      data: currentData.data || [],
      pagination: {
        current: 1,
        pageSize: pageSize,
        lastPage: currentData.lastPage,
        total: currentData.total
      }
    };
  }

  // 防止传入Observable对象
  let result = { ...prevData };

  // 低概率情况下同样的接口被发送了两次，为了避免合并重复数据
  if (result.pagination.current !== currentData.current) {
    let _list = result.data.concat(currentData.data || []);

    return {
      data: _list,
      pagination: {
        current: currentData.current,
        pageSize: pageSize,
        lastPage: currentData.lastPage
      }
    };
  }

  return result;
};
