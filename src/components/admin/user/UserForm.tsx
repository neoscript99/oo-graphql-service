import React from 'react';
import { Form, Input, Modal, Checkbox, Select } from 'antd';
import { EntityForm, EntityFormProps } from '../../layout';
import { commonRules } from '../../../utils';
import { DeptEntity } from '../../../services/DeptService';
import { Entity } from '../../../DomainStore';
import { sha256 } from 'js-sha256';
const { required } = commonRules;
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
              rules: [{ whitespace: false }],
            })(<Input maxLength={16} type="password" placeholder="留空不修改" />)}
          </Form.Item>
          <Form.Item label="称呼">
            {getFieldDecorator('name', {
              rules: [required],
            })(<Input maxLength={16} />)}
          </Form.Item>
          <Form.Item label="单位">
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
    saveItem.password = sha256(saveItem.password);
    super.saveEntity(saveItem);
  }
}

export interface UserFormProps extends EntityFormProps {
  deptList: DeptEntity[];
}
