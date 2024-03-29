import { FormComponentProps } from 'antd/es/form';

declare namespace ArticleFollow {
  interface ArticleType {
    form: FormComponentProps['form'];
  }

  interface ArticleListQuery {
    name?: string;
    id: number;
    current: number;
    pageSize: number;
    keyword: string;
  }

  interface ArticleList {
    id?: number;
    title?: string;
    isTop?: boolean;
    created?: number;
    updated?: number;
    tags?: string | number;
  }

  interface UpdateIstop {
    id: number;
    isTop: boolean;
  }
}
