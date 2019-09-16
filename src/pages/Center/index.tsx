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
  loading: boolean;
}

export default class Index extends React.Component<State> {
  state: State = {
    tagList: [],
    visible: false,
    currentTag: {},
    loading: false,
  };

  async componentDidMount() {
    await this.initTag()
  }

  componentWillUnmount(): void {
    this.setState({
      tagList: [],
      visible: false,
      currentTag: {},
      loading: false,
    })
  }

  async initTag() {
    try {
      const { loading } = this.state;
      if (!loading) this.setState({ loading: true });
      const response = await Api.getCategory();
      const data = response.data.msg || [];
      if (response.data.code === httpStatus.Ok) {
        this.setState({ tagList: data });
      } else {
        message.error(data);
      }
      this.setState({ loading: false })
    } catch (e) {
      message.error(e);
    }
  }

  /**
   * 添加编辑模态框
   * */
  async handleAddUpdate() {
    const { currentTag } = this.state;
    const response = await Api.setCategory(currentTag);
    if (response.data.code === httpStatus.Ok) {
      message.success(response.data.msg);
      await this.initTag()
    } else {
      message.error(response.data.msg);
    }
    const { visible } = this.state;
    await this.setState({
      visible: !visible,
      currentTag: {},
    });
  }

  handleUpdate(text: { id?: number; name?: string; created?: number; updated?: number }) {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
      currentTag: text,
    });
  }

  /**
   * 修改input的值
   * @param name
   */
  inputValChange(name?: { name: string }) {
    const { currentTag } = this.state;
    this.setState({
      currentTag: {
        ...currentTag,
        ...name,
      },
    })
  }

  handleCancel() {
    this.setState({
      visible: false,
      currentTag: {},
    })
  }

  render() {
    const { loading } = this.props;
    const { tagList, visible, currentTag } = this.state;
    return (
      <PageHeaderWrapper title={false}>
        <Button
          onClick={() => this.setState({ visible: !visible })}
          style={{ marginBottom: '20px' }}
          type="primary"
          icon="plus-circle"
        >
          添加
        </Button>
        <Table
          loading={loading}
          dataSource={tagList}
          rowKey="id"
        >
          <Column title="名称" dataIndex="name" key="name" />
          <Column
            title="添加时间"
            dataIndex="created"
            key="created"
            render={(text, record) => <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>}
          />
          <Column
            title="修改时间"
            dataIndex="updated"
            key="updated"
            render={(text, record) => <span>{moment(text * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>}
          />
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
          onOk={() => this.handleAddUpdate()}
          onCancel={() => this.handleCancel()}
          destroyOnClose
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <label style={{ width: 50 }}>标题：</label>
            <Input
              defaultValue={currentTag.name || ''}
              onChange={e => this.inputValChange({ name: e.target.value })}
            />
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}
