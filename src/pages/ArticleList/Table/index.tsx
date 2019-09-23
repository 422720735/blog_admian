import React from 'react';
import { Popconfirm, Table, Pagination } from 'antd';
import { ArticleFollow } from '@/pages/ArticleList/interface';
import * as Api from '../api'

const { Column } = Table;

interface Props {
  dataSource: {
    current: number;
    count: number;
    pageSize: number;
    total: number;
    data: ArticleFollow.ArticleList[],
  },
  articleType: number;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class Index extends React.Component<Props> {
  // eslint-disable-next-line no-useless-constructor
  constructor(props: Props) {
    super(props);
  }

  handlePage = async (page: number) => {
    const { dataSource, articleType } = this.props;
    await Api.getArticleList({ id: articleType, pageSize: dataSource.pageSize, current: page });
  };
  render() {
    const { dataSource } = this.props;
    return (
      <div>
        <Table>
          <Column title="标题" dataIndex="title" key="title"/>
          <Column title="时间" dataIndex="time" key="time"/>
          <Column title="置顶" dataIndex="o" key="o"/>
          <Column title="点击量" dataIndex="c" key="c"/>
          <Column
            title="操作"
            render={(text, record) => (
              <span>
                <a onClick={() => {
                }}>修改</a>&emsp;|&emsp;
                <Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No">
                  <a>删除</a>
                </Popconfirm>
              </span>
            )}
          />
        </Table>
        <Pagination
          defaultCurrent={1}
          total={dataSource.total}
          pageSize={dataSource.pageSize}
          onChange={this.handlePage}
        />
      </div>
    );
  }
};
