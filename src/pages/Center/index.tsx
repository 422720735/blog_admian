import React from 'react';
import { message, Table, Button, Modal, Input, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import * as Api from './api';
import httpStatus from '@/utils/http/returnCode';
import moment from 'moment';

const { Column } = Table;

interface State {
  tagList: { id?: number; created?: number; updated?: number; name?: string }[];
  visible: boolean;
  currentTag: {
    id?: number;
    name?: string;
    created?: number;
    updated?: number;
  };
  title: string;
}

export default class Index extends React.Component<State> {
  state: State = {
    tagList: [],
    visible: false,
    currentTag: {},
    title: '',
  };

  async componentDidMount() {
    try {
      const response = await Api.getCategory();
      const data = response.data.msg || [];
      if (response.data.code === httpStatus.Ok) {
        this.setState({ tagList: data });
      } else {
        message.error(data);
      }
    } catch (e) {
      message.error(e);
    }
  }

  async handleOk() {
    const { currentTag } = this.state;
    const response = await Api.setCategory(currentTag);
    if (response.data.code === httpStatus.Ok) {
      message.success(response.data.msg);
    } else message.error(response.data.msg);
    await this.setState({
      visible: !this.state.visible,
      currentTag: {},
    });
  }

  handleUpdate(text: { id?: number; name?: string; created?: number; updated?: number }) {
    this.setState({
      visible: !this.state.visible,
      currentTag: text,
    });
  }

  render() {
    const { tagList, visible, currentTag } = this.state;
    // @ts-ignore
    return (
      <PageHeaderWrapper title={false}>
        <Button
          onClick={() => this.handleOk()}
          style={{ marginBottom: '20px' }}
          type="primary"
          icon="plus-circle"
        >
          添加
        </Button>
        <Table dataSource={tagList} rowKey="id">
          <Column title="名称" dataIndex="name" key="name" />
          <Column
            title="添加时间"
            dataIndex="created"
            key="created"
            render={(text, record) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>}
          />
          <Column title="修改时间" dataIndex="updated" key="updated" />
          <Column
            title="操作"
            render={(text, record) => (
              <span>
                <a onClick={() => this.handleUpdate(text)}>编辑</a>&emsp;|&emsp;
                <Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No">
                  <a>删除</a>
                </Popconfirm>
              </span>
            )}
          />
        </Table>
        <Modal
          title="Basic Modal"
          visible={visible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleOk()}
          destroyOnClose
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ width: 50 }}>标题：</label>
            <Input defaultValue={currentTag.name || ''} />
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
