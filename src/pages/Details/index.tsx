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
  fileList: {uid: string; name: string; status: string; url: string;}[]
}

function getBase64(file) {
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
    tags: ['Unremovable', 'Tag 2', 'Tag 3'],
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
      {
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-3',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
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

  saveInputRef = input => (this.input = input);

  /***
   * ^标签结束
   */

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

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

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

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
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
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
