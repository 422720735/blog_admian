import React from 'react';
import {
  Card,
  Form,
  Input,
  message,
  Select,
  Checkbox,
  Tag,
  Tooltip,
  Icon,
  Upload,
  Modal,
} from 'antd';
import { DetailsFollow } from '@/pages/Details/interface';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getCategory } from '../Center/api';
import httpStatus from '@/utils/http/returnCode';
import Style from './style.less';
import Editor from './Editor';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;

interface State {
  tagList: { id?: number; created?: number; updated?: number; name?: string }[];
  checked: boolean;
  tags: string[];
  // 标签
  inputVisible: boolean;
  inputValue: string;
  // 照片墙
  previewVisible: boolean;
  previewImage: string;
  fileList: {uid: string; name: string; status: string; url: string;}[],
  fileData: any[],
}

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class Details extends React.Component<DetailsFollow.DetailsForm, State> {
  state: State = {
    tagList: [],
    checked: false,
    tags: [],
    inputVisible: false,
    inputValue: '',

    previewVisible: false,
    previewImage: '',
    fileList: [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
    fileData: [],
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

  /***
   * 标签部分
   * @param removedTag
   */
  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = (input: any) => (this.input = input);

  // 这个是监听文件变化的
  fileChange = (params: UploadChangeParam) => {
    console.log(params)
  }

  // 拦截文件上传
  beforeUploadHandle=(file: RcFile) => {
    console.log(file)
  }

  // 文件列表的删除
  fileRemove=(file: UploadFile) => {
    console.log(file)
  }


  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };

    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { tagList, checked } = this.state;

    const { tags, inputVisible, inputValue } = this.state;

    const { previewVisible, previewImage, fileList } = this.state;

    return (
      <PageHeaderWrapper title={false}>
        <Card>
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

            <Form.Item label="链接">
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

            <Form.Item label="标签">
              {tags.map((tag, index) => {
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag key={tag} closable={index !== 0} onClose={() => this.handleClose(tag)}>
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </Tag>
                );
                return isLongTag ? (
                  <Tooltip title={tag} key={tag}>
                    {tagElem}
                  </Tooltip>
                ) : (
                  tagElem
                );
              })}
              {inputVisible && (
                <Input
                  ref={this.saveInputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onBlur={this.handleInputConfirm}
                  onPressEnter={this.handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                  <Icon type="plus" /> New Tag
                </Tag>
              )}
            </Form.Item>

            <Form.Item label="图片">
              <Upload
                accept="image/*"
                action="http://localhost:4000/api/admin/v2/fileuplaod"
                listType="picture-card"
                beforeUpload={this.beforeUploadHandle}
                onChange={this.fileChange}
                onRemove={this.fileRemove}
              >
                {fileList.length >= 8 ? null : (
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">Upload</div>
                  </div>
                )}
              </Upload>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={() => this.setState({ previewVisible: false })}
              >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Form.Item>
            <Form.Item label="内容">
              <Editor />
            </Form.Item>
          </Form>
        </Card>

      </PageHeaderWrapper>
    )
  }
}

export default Form.create<DetailsFollow.DetailsForm>()(Details)
