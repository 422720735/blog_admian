import React from 'react';
import { Select, Button, Input, message, Form } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import * as Api from './api';
import { getCategory } from '../Center/api';
import Table from './Table';
import httpStatus from '@/utils/http/returnCode';
import { ArticleFollow } from '@/pages/ArticleList/interface';

const { Option } = Select;

interface State {
  loading: boolean;
  tagList: { id?: number; created?: number; updated?: number; name?: string }[];
  list: {
    current: number;
    count: number;
    pageSize: number;
    total: number;
    data: ArticleFollow.ArticleList[];
  };
  articleType: number;
  keyword: string;
}

class Index extends React.Component<ArticleFollow.ArticleType, State> {
  state: State = {
    loading: false,
    tagList: [],
    articleType: 0,
    keyword: '',
    list: {
      current: 1,
      pageSize: 10,
      count: 0,
      total: 0,
      data: [],
    },
  };

  async componentDidMount() {
    await this.initTag();
  }

  // eslint-disable-next-line react/sort-comp
  async initTag() {
    try {
      const { loading, keyword, list } = this.state;
      if (!loading) this.setState({ loading: true });
      const response = await getCategory();
      /**
       * 组装个全部
       * */
      if (response.data.msg.length > 0) {
        response.data.msg.unshift({ name: '全部', id: 0 });
      }
      const data = response.data.msg || [];
      await this.getAllArticle({ id: 0, pageSize: list.pageSize, current: 1, keyword });
      if (response.data.code === httpStatus.Ok) {
        this.setState({ tagList: data });
      } else {
        message.error(data);
      }
      this.setState({ loading: false });
    } catch (e) {
      message.error(e);
    }
  }

  /**
   * 查询分页数据
   * */
  // eslint-disable-next-line class-methods-use-this
  async getAllArticle(params: ArticleFollow.ArticleListQuery) {
    try {
      const response = await Api.getArticleList(params);
      const data = response.data || {};
      if (data.code === httpStatus.Ok) {
        this.setState({ ...{ list: data.msg } });
      }
    } catch (e) {
      message.error(e);
    }
  }

  handleType = async (value: number) => {
    const { list, keyword } = this.state;
    await this.setState({ articleType: value });
    await this.getAllArticle({
      pageSize: list.pageSize,
      current: list.current,
      id: value,
      keyword,
    });
  };

  async currentPage(current: number) {
    const { articleType, list, keyword } = this.state;
    await this.getAllArticle({
      id: articleType,
      pageSize: list.pageSize,
      keyword,
      current,
    });
    this.setState({ list: { ...list, current } });
  }

  async handlePage() {
    const { list, articleType, keyword } = this.state;
    await this.getAllArticle({
      id: articleType,
      pageSize: list.pageSize,
      current: list.current,
      keyword,
    });
  }

  handleKeyword(keyword: { keyword: string }) {
    this.setState({ ...keyword });
  }

  render() {
    const { tagList, loading, list, articleType } = this.state;
    // @ts-ignore
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <PageHeaderWrapper title={false}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Form style={{ display: 'flex' }}>
            <Form.Item>
              {tagList.length > 0 &&
                getFieldDecorator('select', {
                  initialValue: tagList.length > 0 ? tagList[0].id : '', // 这里可以设置一个初始值
                  rules: [{ required: true, message: '选项不能为空！' }],
                })(
                  <Select style={{ width: 200 }} onChange={this.handleType}>
                    {tagList.length > 0
                      ? tagList.map(item => (
                          <Option value={item.id} key={item.id}>
                            {item.name}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
            </Form.Item>
            <Form.Item>
              {tagList.length > 0 &&
                getFieldDecorator('keyword', {
                  initialValue: '', // 这里可以设置一个初始值
                  rules: [{ required: true, message: '选项不能为空！' }],
                })(
                  <Input
                    placeholder="请输入要搜索标题"
                    style={{ width: 200, marginLeft: 10, marginRight: 10 }}
                    onChange={(e: any) => this.handleKeyword({ keyword: e.target.value })}
                  />,
                )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" loading={loading} onClick={() => this.handlePage()}>
                搜索
              </Button>
            </Form.Item>
          </Form>
          <Button onClick={() => {}} style={{ marginTop: '4px' }} type="primary" icon="plus-circle">
            添加
          </Button>
        </div>
        <Table
          dataSource={list}
          tags={tagList}
          articleType={articleType}
          handlePage={(current: number) => this.currentPage(current)}
        />
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(Index);
