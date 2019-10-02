import React from 'react';
import { Card, message, Table, Button, Modal, Input, Popconfirm } from 'antd';
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
   try {
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
   } catch (e) {
     message.error(e);
   }
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

  /**
   * 进行软删除
   * @param id
   */
  async confirm(id: number) {
    try {
      const response = await Api.handleDelTag(id);
      if (response.data.code === httpStatus.Ok) {
        await this.initTag();
        message.success(response.data.msg);
      } else {
        message.error(response.data.msg);
      }
    } catch (e) {
      message.error(e)
    }
  }

  cancel() {
    message.error('Click on No');
  }

  render() {
    const { loading } = this.props;
    const { tagList, visible, currentTag } = this.state;
    return (
      <PageHeaderWrapper title={false}>
        <Card>
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
              render={(text, record) => <span>{ text ? moment(text * 1000).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>}
            />
            <Column
              title="修改时间"
              dataIndex="updated"
              key="updated"
              render={(text, record) => <span>{text ? moment(text * 1000).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>}
            />
            <Column
              title="操作"
              render={(text, record) => (
                <span>
                <a onClick={() => this.handleUpdate(text)}>编辑</a>&emsp;|&emsp;
                  <Popconfirm
                    title="确定要删除吗？"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => this.confirm(text.id)}
                    onCancel={() => this.cancel()}
                  >
                    <a>删除</a>
                  </Popconfirm>
              </span>
              )}
            />
          </Table>
          <Modal
            title={Object.keys(currentTag).length > 0 ? '编辑' : '新增'}
            visible={visible}
            onOk={() => this.handleAddUpdate()}
            onCancel={() => this.handleCancel()}
            destroyOnClose
          >
            <form style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label style={{ width: 50 }}>标题：</label>
              <Input
                defaultValue={currentTag.name || ''}
                onChange={e => this.inputValChange({ name: e.target.value })}
              />
            </form>
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
