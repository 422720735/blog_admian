import React from 'react';
import { Popconfirm, Table } from 'antd';
import { ArticleFollow } from '@/pages/ArticleList/interface';
import { fetchIsTop } from '../api';
import moment from 'moment';
import { message } from 'antd/es';
import router from 'umi/router';
import httpStatus from '@/utils/http/returnCode';

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
  tags: { id?: number; created?: number; updated?: number; name?: string }[];

}

// eslint-disable-next-line react/prefer-stateless-function
export default class Index extends React.Component<Props> {
  // eslint-disable-next-line no-useless-constructor
  constructor(props: Props) {
    super(props);
  }

  handlePage = async (page: number) => {
    this.props.handlePage(page);
  };

  private itemType(type: number) {
    const { tags } = this.props;
    let typeName = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < tags.length; i++) {
      if (tags[i].id === type) {
        // @ts-ignore
        typeName = tags[i].name;
        break;
      }
    }
    return typeName;
  }

  // eslint-disable-next-line class-methods-use-this
  private async handleIsTop(params: ArticleFollow.UpdateIstop) {
    try {
      const response = await fetchIsTop(params);
      if (response.data.code === httpStatus.Ok) {
        message.success(response.data.msg);
      } else {
        message.error(response.data.msg);
      }
    } catch (e) {
      message.error(e);
    }
  }

  private hanleUpdaInfo(id: number) {
    router.push({
      pathname: '/center/details',
      query: {
        id,
      },
    })
  }


  render() {
    const { dataSource } = this.props;
    const { data } = dataSource;
    return (
      <div>
        <Table
          dataSource={data}
          rowKey={record => `${record.id}`}
          pagination={{
            total: dataSource.total,
            current: dataSource.current,
            pageSize: dataSource.pageSize,
            onChange: this.handlePage,
            showQuickJumper: true,
          }}
        >
          <Column title="标题" dataIndex="title" key="title" />
          <Column
            title="分类"
            render={(text, record) => (
              <span>{text.categoryId && this.itemType(text.categoryId)}</span>
            )}
          />
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
            render={(text, record) =>
              (text.isTop ? (
                <Popconfirm
                  title="当前数据是否需要普通？"
                  placement="rightTop"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => this.handleIsTop({ id: text.id, isTop: !text.isTop })}
                >
                  <a style={{ color: '#f5222d' }}>置顶</a>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="当前数据是否需要修改为置顶？"
                  placement="rightTop"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => this.handleIsTop({ id: text.id, isTop: !text.isTop })}
                >
                  <a>普通</a>
                </Popconfirm>
              ))
            }
          />
          <Column title="点击量" render={(text, record) => <span>{text.views}</span>} />
          <Column
            title="操作"
            render={(text, record) => (
              <span>
                <a onClick={() => this.hanleUpdaInfo(text.id)}>修改</a>&emsp;|&emsp;
                <Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No">
                  <a>删除</a>
                </Popconfirm>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}
