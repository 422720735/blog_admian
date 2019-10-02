import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

export default class EditorDemo extends React.Component {

  render () {
    return (
      <div className="my-component">
        <BraftEditor/>
      </div>
    )

  }

}
