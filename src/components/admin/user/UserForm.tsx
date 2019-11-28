import React from 'react';
import { Form, Input, Modal, Checkbox, Select } from 'antd';
import { EntityForm, EntityFormProps } from '../../layout';
import { commonRules } from '../../../utils';
import { DeptEntity } from '../../../services/DeptService';
import { Entity } from '../../../DomainStore';
import { sha256 } from 'js-sha256';
import { CheckboxOptionType, CheckboxValueType } from 'antd/lib/checkbox/Group';
import { AdminServices } from '../AdminServices';
const { required } = commonRules;
const INIT_PASSWORD = 'abc000';

interface S {
  allRoles: CheckboxOptionType[];
  userRoleIds: string[];
  deptList: DeptEntity[];
}
export class UserForm extends EntityForm<UserFormProps, S> {
  roleIds: string[] = [];
  async componentDidMount() {
    const {
      inputItem,
      services: { userRoleService, roleService, deptService },
    } = this.props;
    const deptList = deptService.store.allList.filter(dept => dept.enabled) as DeptEntity[];
    const allRoles: CheckboxOptionType[] = roleService.store.allList
      .filter(role => role.enabled)
      .map(role => ({ label: role.roleName as string, value: role.id as string }));
    const state: any = {
      allRoles,
      deptList,
    };
    if (inputItem && inputItem.id) {
      const userRoleIds: string[] = await userRoleService
        .list({ criteria: { eq: [['user.id', inputItem.id]] } })
        .then(res => {
          return res.results.map(ur => ur.role.id);
        });
      this.roleIds = userRoleIds;
      state.userRoleIds = userRoleIds;
    }
    this.setState(state);
  }

  render() {
    if (!this.state) return null;
    const {
      form: { getFieldDecorator },
      title,
      okText,
    } = this.props;
    const { allRoles, userRoleIds, deptList } = this.state;
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
                {deptList.map(dept => (
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
          <Form.Item label="角色">
            <Checkbox.Group options={allRoles} defaultValue={userRoleIds} onChange={this.onChangeRoles.bind(this)} />,
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  saveEntity(saveItem: Entity) {
    saveItem.dept = { id: saveItem.deptId };
    const { inputItem } = this.props;
    const initPassword = this.props.initPassword || INIT_PASSWORD;
    //修改时，如果密码为初始密码，不做改动
    //但同时，密码也不能改回初始密码
    if (inputItem && inputItem.id && saveItem.password === initPassword) saveItem.password = inputItem.password;
    else if (inputItem && saveItem.password !== inputItem.password) saveItem.password = sha256(saveItem.password);
    const { userRoleService } = this.props.services;
    return userRoleService.saveUserRoles({ ...inputItem, ...saveItem }, this.roleIds);
  }

  onChangeRoles(roleIds: CheckboxValueType[]) {
    this.roleIds = roleIds as string[];
  }
}

export interface UserFormProps extends EntityFormProps {
  initPassword?: string;
  services: AdminServices;
}
