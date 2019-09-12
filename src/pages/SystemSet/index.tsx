import React from 'react';
import {
  Form,
  Input,
  Button,
  Switch,
}
  from 'antd';
import { SystemSetFollow } from '@/pages/SystemSet/interface';

// eslint-disable-next-line react/prefer-stateless-function
class SystemSet extends React.Component<SystemSetFollow.SystemForm> {
  handleSystem() {
    const { form } = this.props;
    form.validateFields((err, data) => {
      console.log(data, err)
      debugger
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 8 },
    };
    return (
      <Form {...formItemLayout} onSubmit={() => this.handleSystem()}>
        <Form.Item label="标题：" hasFeedback>
          {getFieldDecorator('title', {
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
            rules: [
              {
                required: true,
                message: '必填项不能为空!',
              },
            ],
          })(<Input/>)}
        </Form.Item>
        <Form.Item label="开关：">
          {getFieldDecorator('start', {
            rules: [
              {
                required: false,
              },
            ],
          })(<Switch/>)}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 3 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create<SystemSetFollow.SystemForm>()(SystemSet);
