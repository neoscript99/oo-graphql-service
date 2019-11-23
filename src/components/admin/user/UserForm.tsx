import React from 'react';
import { Form, Input, Modal, Checkbox } from 'antd';
import { EntityForm } from '../../layout';
import { commonRules } from '../../../utils';
const { required } = commonRules;
export class UserForm extends EntityForm {
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
            })(<Input maxLength={16} type="password" />)}
          </Form.Item>
          <Form.Item label="称呼">
            {getFieldDecorator('name', {
              rules: [required],
            })(<Input maxLength={16} />)}
          </Form.Item>
          <Form.Item label="启用">
            {getFieldDecorator('enabled', {
              valuePropName: 'checked',
            })(<Checkbox />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
