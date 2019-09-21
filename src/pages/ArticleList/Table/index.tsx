import React from 'react';
import { Popconfirm, Table } from 'antd';

const { Column } = Table;

export default class Index extends React.Component<any> {
  render() {
    return (
      <div>
        <Table>
          <Column title="标题" dataIndex="title" key="title" />
          <Column title="时间" dataIndex="time" key="time" />
          <Column title="置顶" dataIndex="o" key="o" />
          <Column title="点击量" dataIndex="c" key="c" />
          <Column
            title="操作"
            render={(text, record) => (
              <span>
                <a onClick={() => {}}>修改</a>&emsp;|&emsp;
                <Popconfirm title="确定要删除吗？" okText="Yes" cancelText="No">
                  <a>删除</a>
                </Popconfirm>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}
