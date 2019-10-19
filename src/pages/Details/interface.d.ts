import { FormComponentProps } from 'antd/es/form';

declare namespace DetailsFollow {
  interface DetailsForm {
    form: FormComponentProps['form'];
  }

  interface formSubmit {
    id?: number;
    /**
     * 标题
     */
    title: string;
    /**
     * 类型
     */
    categoryId: number;
    /**
     * 外部链接
     */
    url?: string;
    /**
     * 置顶
     */
    isTop: boolean;
    /**
     * 标签
     */
    tags: string; // a1, a2, a3 多个值 ","分割
    /**
     * 封面
     * */
    image: string;
    /**
     * 内容 富文本部分
     */
    content: string;
  }

  interface postInfoV extends formSubmit {
    userId: number;
    /**
     * 阅读量
     */
    views: number;
    /**
     * 创建时间
     */
    created: number;
    /**
     * 更新时间
     */
    updated: number;
    /**
     * 后面暂定
     */
    types: number;
    info: string;
  }
}
