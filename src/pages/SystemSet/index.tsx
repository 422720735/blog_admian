import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { SystemSetFollow } from '@/pages/SystemSet/interface';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import * as Api from './api';
import httpStatus from '@/utils/http/returnCode';

interface State {
  system: {
    title?: string;
    url?: string;
    keywords?: string;
    description?: string;
    email?: string;
    start?: string;
    qq?: string;
  };
}

class SystemSet extends React.Component<SystemSetFollow.SystemForm> {
  state: State = {
    system: {},
  };

  async componentDidMount() {
    try {
      const response = await Api.getSystem();
      const data = response.data.msg || {};
      if (response.data.code === httpStatus.Ok) {
        this.setState({ system: data });
      }
    } catch (e) {
      message.error(e);
    }
  }

  handleSystem() {
    const { form } = this.props;
    const { system } = this.state;
    form.validateFields((err, data) => {
      if (!err) {
        const params = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const key in system) {
          if (data[key] !== system[key]) {
            params[key] = system[key];
            break;
          }
        }
        const empty = Object.keys(params);
        if (empty.length > 0) {
          data.start = data.start ? '1' : '';
          const response = Api.postSystem(data);
          response
            .then(res => {
              if (res.data.code === httpStatus.Ok) {
                message.success(res.data.msg);
                this.setState({ system: {} });
              } else {
                message.error(res.data.msg);
              }
            })
            .catch(e => {
              message.error(e);
            });
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { system } = this.state;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 8 },
    };
    return (
      <PageHeaderWrapper title={false}>
        <Card>
          <Form {...formItemLayout} onClick={() => this.handleSystem()}>
            <Form.Item label="标题：" hasFeedback>
              {getFieldDecorator('title', {
                initialValue: system.title || '',
                rules: [
                  {
                    required: true,
                    message: '必填项不能为空!',
                  },
                ],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="网址：" hasFeedback>
              {getFieldDecorator('url', {
                initialValue: system.url || '',
                rules: [
                  {
                    required: true,
                    message: '必填项不能为空!',
                  },
                ],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="关键字：" hasFeedback>
              {getFieldDecorator('keywords', {
                initialValue: system.keywords || '',
                rules: [
                  {
                    required: true,
                    message: '必填项不能为空!',
                  },
                ],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="描述：" hasFeedback>
              {getFieldDecorator('description', {
                initialValue: system.description || '',
                rules: [
                  {
                    required: true,
                    message: '必填项不能为空!',
                  },
                ],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="邮箱：" hasFeedback>
              {getFieldDecorator('email', {
                initialValue: system.email || '',
                rules: [
                  {
                    required: true,
                    type: 'email',
                    message: '必填项不能为空!',
                  },
                ],
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="QQ：" hasFeedback>
              {getFieldDecorator('qq', {
                initialValue: system.qq || '',
                rules: [
                  {
                    required: true,
                    message: '必填项不能为空!',
                  },
                ],
              })(<Input/>)}
            </Form.Item>
            {/*
          <Form.Item label="开关：">
            {getFieldDecorator('start', {
              initialValue: system.start || '',
            })(
              <Switch
                checked={system.start === '1'}
                checkedChildren="开启"
                unCheckedChildren="关闭"
              />,
            )}
          </Form.Item>
          */}
            <Form.Item wrapperCol={{ span: 12, offset: 3 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<SystemSetFollow.SystemForm>()(SystemSet);
