import React, { Component, CSSProperties } from 'react';
import { Button, Popconfirm } from 'antd';
import { OperatorSwitch } from './EntityList';

export interface OperatorBarProps {
  onCreate: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  operatorVisible?: OperatorSwitch;
  operatorEnable: OperatorSwitch;
}

const buttonCss: CSSProperties = {
  marginRight: '0.5rem',
};

export class OperatorBar extends Component<OperatorBarProps> {
  render() {
    const { onCreate, onUpdate, onDelete, operatorVisible, operatorEnable } = this.props;
    if (!operatorVisible) return null;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {operatorVisible.create && (
          <Button type="primary" icon="plus-circle" style={buttonCss} onClick={onCreate}>
            新增
          </Button>
        )}
        {operatorVisible.create && (
          <Button type="primary" disabled={!operatorEnable.update} icon="edit" style={buttonCss} onClick={onUpdate}>
            修改
          </Button>
        )}
        {operatorVisible.delete && (
          <Popconfirm
            title="确定删除所选记录吗?"
            onConfirm={onDelete}
            okText="确定"
            cancelText="取消"
            disabled={!operatorEnable.delete}
          >
            <Button type="primary" disabled={!operatorEnable.delete} icon="delete" style={buttonCss}>
              删除
            </Button>
          </Popconfirm>
        )}
      </div>
    );
  }
}
