import React from 'react';
import { Select, Button, Input, message, Form } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import * as Api from './api';
import { getCategory } from '../Center/api'
import Table from './Table';
import httpStatus from '@/utils/http/returnCode';
import { ArticleFollow } from '@/pages/ArticleList/interface';

const { Option } = Select;

interface State {
  loading: boolean;
  tagList: { id?: number; created?: number; updated?: number; name?: string }[];
}


class Index extends React.Component<ArticleFollow.ArticleType, State> {
  state: State = {
    loading: false,
    tagList: [],
  };

  async componentDidMount() {
    await this.initTag();
  }

  async initTag() {
    try {
      const { loading } = this.state;
      if (!loading) this.setState({ loading: true });
      const response = await getCategory();
      /**
       * 组装个全部
       * */
      if (response.data.msg.length > 0) {
        response.data.msg.unshift({ name: '全部', id: 0 });
      }
      const data = response.data.msg || [];
      await this.getAllArticle({ id: 0, pageSize: 10, current: 1 });
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
  async getAllArticle(params: ArticleFollow.ArticleList) {
    try {
      await Api.getArticleList(params);
    } catch (e) {
      message.error(e);
    }
  }

  render() {
    const { tagList, loading } = this.state;
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
                  <Select style={{ width: 200 }}>
                    {tagList.length > 0
                      ? tagList.map((item, index) => (
                          <Option value={item.id} key={index}>
                            {item.name}
                          </Option>
                        ))
                      : null}
                  </Select>,
                )}
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="请输入要搜索标题"
                style={{ width: 200, marginLeft: 10, marginRight: 10 }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" loading={loading}>
                搜索
              </Button>
            </Form.Item>
          </Form>
          <Button
            onClick={() => {}}
            style={{ marginBottom: '20px' }}
            type="primary"
            icon="plus-circle"
          >
            添加
          </Button>
        </div>
        <Table />
      </PageHeaderWrapper>
    );
  }
}
export default Form.create()(Index);
