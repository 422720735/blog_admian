import { FormComponentProps } from 'antd/es/form';

declare namespace ArticleFollow {
  interface ArticleType {
    form: FormComponentProps['form'];
  }

  interface ArticleList {
    name?: string;
    id: number;
    current: number;
    pageSize: number;
  }
}
