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
  Button,
} from 'antd';

import { DetailsFollow } from '@/pages/Details/interface';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getCategory } from '../Center/api';
import * as Api from './api';
import httpStatus from '@/utils/http/returnCode';
import Style from './style.less';
import Editor from './Editor';
import reg from '../../utils/RegExp';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import { UploadFile } from 'antd/es/upload/interface';
import { splitTags } from '../../utils/magic';

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
  fileData: any[];
  html: string;
  loadBool: boolean;
  articleInfo: DetailsFollow.postInfoV;
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
    fileData: [],
    html: '',
    loadBool: false,
    articleInfo: {},
  };

  private input: any;

  private handleIsTop() {
    const { checked } = this.state;
    this.setState({ checked: !checked });
  }

  /** *
   * 标签部分
   * @param removedTag
   */
  // eslint-disable-next-line react/sort-comp
  handleClose = (removedTag: any) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e: { target: { value: string } }) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  // eslint-disable-next-line no-return-assign
  saveInputRef = (input: any) => (this.input = input);

  // 拦截文件上传
  beforeUploadHandle = (file: RcFile) => {
    /**
     * 上传文件之前的钩子，
     * 参数为上传的文件，若返回 false 则停止上传。
     * 支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，
     * resolve 时开始上传（ resolve 传入 File 或 Blob 对象则上传 resolve 传入对象）。注意：IE9 不支持该方法。
     */
    if (file.size > 1024 * 1024 * 3) {
      message.error('你上传的文件过大，请重新上传');
    }
    this.setState(
      ({ fileData }) => ({
        fileData: [...fileData, file],
      }),
      () => {
        this.uploadProps();
      },
    );
    return false;
  };

  // 文件列表的删除
  fileRemove = (file: UploadFile) => {
    this.setState(() => {
      return {
        fileData: [],
      };
    });
  };

  async componentDidMount() {
    try {
      const response = await getCategory();
      const data = response.data.msg || [];
      if (response.data.code === httpStatus.Ok) {
        this.setState({ tagList: data });
      } else {
        message.error(data);
      }
      if (this.props.location.query.id) {
        const responseTo = await Api.getArticleInfo(this.props.location.query.id);
        // eslint-disable-next-line no-empty
        if (responseTo.data.code === httpStatus.Ok) {
          const articleInfo = responseTo.data.msg;
          this.setState({ articleInfo });
          if (articleInfo.tags && articleInfo.tags !== '' && articleInfo.tags !== ',') {
            const labeling = splitTags(articleInfo.tags);
            this.setState({ tags: labeling });
          }
          if (!articleInfo.image || articleInfo.image !== '') {
            this.setState({
              fileData: [
                {
                  uid: '1',
                  url: `http://pz8o2was4.bkt.clouddn.com/${articleInfo.image}`,
                },
              ],
            });
          }
        } else {
          message.error(responseTo.data.msg);
        }
      }
    } catch (e) {
      message.error(e);
    }
  }

  async uploadProps() {
    const { fileData } = this.state;
    const UpImg = new FormData();
    UpImg.append('file', fileData[0]);
    try {
      const response = await Api.uploadFormData(UpImg);
      if (response.data.code === httpStatus.Ok) {
        message.success('图片上传成功', () => {
          this.setState({ imgStr: response.data.msg });
        });
      } else {
        message.error(response.data.msg);
        this.setState({ fileData: [] });
      }
    } catch (e) {
      message.error(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleSubmit = (e: any) => {
    const { tags, articleInfo, fileData } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.image = '';
        values.tags = '';
        if (tags.length > 0) {
          values.tags = tags.join(',');
          values.tags += ',';
        }
        if (articleInfo.id) {
          values.id = articleInfo.id;
        }
        values.image = `${fileData[0]}`;
        values.content = this.state.html;
        switch (values.isTop) {
          case 0:
            values.isTop = false;
            break;
          case 1:
            values.isTop = true;
            break;
          default:
            values.isTop = false;
        }
        this.fetchForm(values);
        this.setState({ loadBool: true });
      }
    });
  };

  private async fetchForm(params: DetailsFollow.formSubmit) {
    try {
      const response = await Api.insertArticleInfo(params);
      if (response.data.code === httpStatus.Ok) {
        message.success(response.data.msg);
      } else {
        message.error(response.data.msg);
      }
    } catch (e) {
      message.error(e);
    }
    this.setState({ loadBool: false });
  }

  checkUrl = (rule: any, value: string, callback: Function) => {
    if (!value || value === '') {
      callback();
      return;
    }
    const bool = reg(value);
    if (!bool) {
      callback('不是正确的网址吧，请注意检查!');
    } else callback();
  };

  render() {
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    };
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {
      tags,
      inputVisible,
      inputValue,
      previewVisible,
      previewImage,
      tagList,
      checked,
      fileData,
      loadBool,
      articleInfo,
    } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const isUpdate = Object.keys(articleInfo);
    return (
      <PageHeaderWrapper title={false}>
        <Card>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="标题：" hasFeedback>
              {getFieldDecorator('title', {
                initialValue: isUpdate.length > 0 ? articleInfo.title : '',
                rules: [
                  {
                    required: true,
                    message: '必填项不能为空!',
                  },
                ],
              })(<Input />)}
            </Form.Item>

            <Form.Item label="类别：" hasFeedback>
              {tagList.length > 0 &&
                getFieldDecorator('categoryId', {
                  initialValue: isUpdate.length > 0 ? articleInfo.categoryId : '',
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
              {getFieldDecorator('isTop', {
                initialValue: isUpdate.length > 0 ? articleInfo.isTop : false,
              })(
                <Checkbox
                  className={!checked && Style.NO}
                  checked={checked}
                  onChange={() => this.handleIsTop()}
                >
                  置首
                </Checkbox>,
              )}
            </Form.Item>

            <Form.Item label="链接">
              {getFieldDecorator('url', {
                initialValue: isUpdate.length > 0 ? articleInfo.url : '',
                rules: [
                  {
                    required: false,
                    message: '不是正确的网址吧，请注意检查!',
                  },
                  {
                    validator: this.checkUrl,
                  },
                ],
              })(<Input placeholder="配置跳转到外部链接" />)}
            </Form.Item>

            <Form.Item label="标签">
              {tags.map(tag => {
                const isLongTag = tags.length > 20;
                const tagElem = (
                  <Tag key={tag} closable onClose={() => this.handleClose(tag)}>
                    {tag}
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
                fileList={fileData}
                beforeUpload={this.beforeUploadHandle}
                onPreview={this.handlePreview}
                onRemove={this.fileRemove}
              >
                {fileData.length >= 1 ? null : uploadButton}
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
              {getFieldDecorator('content')(
                <Editor
                  dataSource={isUpdate.length > 0 ? articleInfo.content : ''}
                  onHandleInnerHTML={(text: string) => this.setState({ html: text })}
                />,
              )}
            </Form.Item>

            <Form.Item>
              <Button loading={loadBool} type="primary" htmlType="submit">
                {isUpdate.length > 0 ? '编辑' : '新增'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<DetailsFollow.DetailsForm>()(Details);
