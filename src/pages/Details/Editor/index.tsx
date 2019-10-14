import React from 'react'
// import * as qiniu from 'qiniu-js'
import BraftEditor, { EditorState } from 'braft-editor'
import _ from 'lodash';
import 'braft-editor/dist/index.css'

interface Props {
  onHandleInnerHTML: Function
}

interface State {
  editorState: EditorState
}

export default class EditorDemo extends React.Component<Props, State> {
  // eslint-disable-next-line no-useless-constructor
  constructor(props: Props) {
    super(props);
    this.innerHtml =  _.debounce(this.innerHtml, 888);
  }

  state: State = {
    editorState: BraftEditor.createEditorState(null),
  }

  // @ts-ignore
  componentDidMount() {
    this.setState({
      editorState: BraftEditor.createEditorState(''),
    });
  }

  submitContent = async () => {
    const { onHandleInnerHTML } = this.props;
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    onHandleInnerHTML(htmlContent)
    // const result = await saveEditorContent(htmlContent)
  }

  handleEditorChange = (editorState: EditorState) => {
    this.innerHtml(editorState)
  }

  innerHtml = (editorState: EditorState) => {
    this.setState({ editorState });
    const html = editorState.toHTML();
    const { onHandleInnerHTML } = this.props;
    onHandleInnerHTML(html)
  }

  uploadFn = (param) => {
    const token = 'HhUn8qmWzyd2im3VicF18d32zFB14OL142IxJafU:Va2RRYOz2tQXYWVdoJ4dfU92U9c=:eyJzY29wZSI6InN0YXRpYy1pbWFnZSIsImRlYWRsaW5lIjoxNTQ0NDYyMTk1fQ=='
    const putExtra = {
    }
    const config = {
    }
    const observer = {
      next(res) {
        param.progress(res.total.percent)
      },
      error(err) {
        param.error({
          msg: err.message,
        })
      },
      complete(res) {
        param.success({
          url: 'http://pjid0qjkn.bkt.clouddn.com/' + res.key
        })
      }
    }
    // qiniu.upload(param.file, param.name, token, putExtra, config).subscribe(observer)
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className="my-component">
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          onSave={this.submitContent}
          media={{ uploadFn: this.uploadFn }}
        />
      </div>
    )
  }
}
