import React from 'react';
import { Form, Input, Modal, Checkbox, Select } from 'antd';
import { EntityForm, EntityFormProps } from '../../layout';
import { commonRules } from '../../../utils';
import { DeptEntity } from '../../../services/DeptService';
import { Entity } from '../../../DomainStore';
import { sha256 } from 'js-sha256';
const { required } = commonRules;
const INIT_PASSWORD = 'abc000';
export class UserForm extends EntityForm<UserFormProps> {
  render() {
    const {
      form: { getFieldDecorator },
      title,
      okText,
    } = this.props;
    return (
      <Modal
        visible={true}
        title={title}
        okText={okText}
        onCancel={this.handleCancel.bind(this)}
        onOk={this.handleOK.bind(this)}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Form.Item label="帐号">
            {getFieldDecorator('account', {
              rules: [required],
            })(<Input maxLength={16} />)}
          </Form.Item>
          <Form.Item label="密码">
            {getFieldDecorator('password', {
              rules: [required],
              initialValue: INIT_PASSWORD,
            })(<Input maxLength={16} type="password" allowClear />)}
          </Form.Item>
          <Form.Item label="称呼">
            {getFieldDecorator('name', {
              rules: [required],
            })(<Input maxLength={16} />)}
          </Form.Item>
          <Form.Item label="机构">
            {getFieldDecorator('deptId', {
              rules: [required],
            })(
              <Select>
                {this.props.deptList.map(dept => (
                  <Select.Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="启用">
            {getFieldDecorator('enabled', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  saveEntity(saveItem: Entity) {
    saveItem.dept = { id: saveItem.deptId };
    saveItem.deptId = undefined;
    const { inputItem } = this.props;
    const initPassword = this.props.initPassword || INIT_PASSWORD;
    //修改时，如果密码为初始密码，不做改动
    //但同时，密码也不能改回初始密码
    if (inputItem && inputItem.id && saveItem.password === initPassword) saveItem.password = inputItem.password;
    else if (inputItem && saveItem.password !== inputItem.password) saveItem.password = sha256(saveItem.password);
    super.saveEntity(saveItem);
  }
}

export interface UserFormProps extends EntityFormProps {
  deptList: DeptEntity[];
  initPassword?: string;
}
