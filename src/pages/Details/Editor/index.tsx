import React from 'react';
// import * as qiniu from 'qiniu-js'
import BraftEditor, { EditorState } from 'braft-editor';
import _ from 'lodash';
import 'braft-editor/dist/index.css';

interface Props {
  onHandleInnerHTML: Function;
  dataSource: string;
}

interface State {
  editorState: EditorState;
}

export default class EditorDemo extends React.Component<Props, State> {
  // eslint-disable-next-line no-useless-constructor
  constructor(props: Props) {
    super(props);
    this.innerHtml = _.debounce(this.innerHtml, 888);
  }

  state: State = {
    editorState: BraftEditor.createEditorState(null),
  };

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.dataSource && nextProps.dataSource !== '') {
      this.setState({
        editorState: BraftEditor.createEditorState(nextProps.dataSource),
      });
    }
  }

  submitContent = async () => {
    const { onHandleInnerHTML } = this.props;
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.editorState.toHTML();
    onHandleInnerHTML(htmlContent);
    // const result = await saveEditorContent(htmlContent)
  };

  handleEditorChange = (editorState: EditorState) => {
    this.innerHtml(editorState);
  };

  innerHtml = (editorState: EditorState) => {
    this.setState({ editorState });
    const html = editorState.toHTML();
    const { onHandleInnerHTML } = this.props;
    onHandleInnerHTML(html);
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className="my-component">
        <BraftEditor
          value={editorState}
          // onChange={this.handleEditorChange}
          onSave={this.submitContent}
        />
      </div>
    );
  }
}
