import React from 'react';
import { Popconfirm, Table, Pagination } from 'antd';
import { ArticleFollow } from '@/pages/ArticleList/interface';
import moment from 'moment';
import * as Api from '../api';

const { Column } = Table;

interface Props {
  dataSource: {
    current: number;
    count: number;
    pageSize: number;
    total: number;
    data: ArticleFollow.ArticleList[];
  };
  articleType: number;
  handlePage: Function;
}

// eslint-disable-next-line react/prefer-stateless-function
export default class Index extends React.Component<Props> {
  // eslint-disable-next-line no-useless-constructor
  constructor(props: Props) {
    super(props);
  }

  handlePage = async (page: number) => {
    // console.log(page);
    this.props.handlePage(page);
    // const { dataSource, articleType } = this.props;
    // await Api.getArticleList({ id: articleType, pageSize: dataSource.pageSize, current: page });
  };

  render() {
    const { dataSource } = this.props;
    const { data } = dataSource;
    return (
      <div>
        <Table
          dataSource={data}
          pagination={{
            total: dataSource.total,
            current: dataSource.current,
            pageSize: dataSource.pageSize,
            onChange: this.handlePage,
          }}
        >
          <Column title="标题" dataIndex="title" key="title" />
          <Column
            title="创建时间"
            render={(text, record) => (
              <span>
                {text.created > 0
                  ? moment(text.created * 1000).format('YYYY-MM-DD HH:mm')
                  : '--:--'}
              </span>
            )}
          />
          <Column
            title="修改时间"
            render={(text, record) => (
              <span>
                {text.created > 0
                  ? moment(text.updated * 1000).format('YYYY-MM-DD HH:mm')
                  : '--:--'}
              </span>
            )}
          />
          <Column
            title="置顶"
            render={(text, record) => <span>{text.isTop === 1 ? '普通' : '置顶'}</span>}
          />
          <Column title="点击量" dataIndex="c" key="c" />
          <Column
            title="操作"
            render={(text, record) => (
              <span>
                <a onClick={() => {}}>修改</a>&emsp;|&emsp;
                <Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No">
                  <a>删除</a>
                </Popconfirm>
              </span>
            )}
          />
        </Table>
        {/*<Pagination*/}
        {/*  defaultCurrent={1}*/}
        {/*  total={dataSource.total}*/}
        {/*  pageSize={dataSource.pageSize}*/}
        {/*  onChange={this.handlePage}*/}
        {/*/>*/}
      </div>
    );
  }
}
