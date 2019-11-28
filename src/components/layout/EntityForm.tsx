import React, { Component } from 'react';

import { Form, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { Entity } from '../../DomainStore';
import { EntityColumnProps } from './EntityList';

export interface EntityFormProps extends FormComponentProps {
  title: string;
  okText: string;
  domainService: DomainService<MobxDomainStore>;
  columns: EntityColumnProps[];
  inputItem?: Entity;
  onSuccess: (item: Entity) => void;
  onError: (reason: any) => void;
  onCancel: () => void;

  [key: string]: any;
}

export class EntityForm<P extends EntityFormProps = EntityFormProps, S = any> extends Component<P, S> {
  handleCancel() {
    this.props.onCancel();
  }

  handleOK() {
    const { form } = this.props;
    form.validateFields((err, saveItem) => err || this.handleSave(saveItem));
  }

  handleSave(saveItem: Entity) {
    const { onSuccess, onError } = this.props;

    this.saveEntity(saveItem)
      .then(v => {
        message.success('保存成功');
        onSuccess(v);
        return v;
      })
      .catch(reason => {
        console.error(reason);
        onError(reason);
      });
  }

  saveEntity(saveItem: Entity) {
    const { domainService, inputItem } = this.props;
    return domainService.save({ ...inputItem, ...saveItem });
  }

  static formWrapper = Form.create({
    name: `EntityForm_${new Date().toISOString()}`,
    mapPropsToFields(props: EntityFormProps) {
      const { inputItem, columns } = props;
      if (inputItem)
        return Object.keys(inputItem).reduce((fieldMap, key) => {
          fieldMap[key] = Form.createFormField({
            value: inputItem[key],
          });
          return fieldMap;
        }, {});
      else
        return columns.reduce((fieldMap, col) => {
          if (col.dataIndex && col.initValue !== undefined)
            fieldMap[col.dataIndex] = Form.createFormField({
              value: col.initValue,
            });
          return fieldMap;
        }, {});
    },
  });
}
