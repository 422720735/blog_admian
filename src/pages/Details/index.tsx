import React from 'react';
import {
  Form,
  Input,
  message,
  Select,
  Checkbox,
} from 'antd';
import { DetailsFollow } from '@/pages/Details/interface';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getCategory } from '../Center/api';
import httpStatus from '@/utils/http/returnCode';
import Style from './style.less';

const { Option } = Select;

interface State {
  tagList: { id?: number; created?: number; updated?: number; name?: string }[];
  checked: boolean;
}

class Details extends React.Component<DetailsFollow.DetailsForm, State> {
  state: State = {
    tagList: [],
    checked: false,
  };

  async componentDidMount() {
    await this.initTag();
  }

  async initTag() {
    try {
      const response = await getCategory();
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

  private handleIsTop() {
    const { checked } = this.state;
    this.setState({ checked: !checked })
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { tagList, checked } = this.state;
    return (
      <PageHeaderWrapper title={false}>
        <Form {...formItemLayout}>
          <Form.Item label="标题：" hasFeedback>
            {getFieldDecorator('title', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '必填项不能为空!',
                },
              ],
            })(<Input/>)}
          </Form.Item>

          <Form.Item label="类别：" hasFeedback>
            {tagList.length > 0 &&
            getFieldDecorator('select', {
              initialValue: '',
              rules: [{ required: true, message: '选项不能为空！' }],
            })(
              <Select>
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
          <Form.Item label="加入首页">
            <Checkbox
              className={!checked && Style.NO}
              checked={checked}
              onChange={() => this.handleIsTop()}
            >置首</Checkbox>
          </Form.Item>
        </Form>
      </PageHeaderWrapper>
    )
  }
}

export default Form.create<DetailsFollow.DetailsForm>()(Details)
