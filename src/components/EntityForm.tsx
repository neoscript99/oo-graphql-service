import React, { Component } from 'react';

import { Form, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form';
import { DomainService } from '../DomainService';
import { MobxDomainStore } from '../mobx';
import { Entity } from '../DomainStore';
import { EntityColumnProps } from './EntityList';

export interface EntityFormProps extends FormComponentProps {
  title: string
  okText: string
  domainService: DomainService<MobxDomainStore>
  columns: EntityColumnProps[]
  item?: Entity
  onSuccess: (item: Entity) => void
  onError: (reason: any) => void
  onCancel: () => void
}

export class EntityForm extends Component<EntityFormProps> {

  handleCancel = () => {
    this.props.onCancel()
  }

  handleOK = () => {
    const { form, domainService, item, onSuccess, onError } = this.props
    form.validateFields((err, values) =>
      err || domainService.save({ ...item, ...values })
        .then(v => {
          message.success('保存成功')
          this.setState({ visible: false });
          onSuccess(v)
        })
        .catch(reason => {
          console.error(reason)
          onError(reason)
        }))
  }

  static formWrapper = Form.create({
    name: new Date().toISOString(), mapPropsToFields(props: EntityFormProps) {
      const { item, columns } = props;
      if (item)
        return Object.keys(item)
          .reduce((fieldMap, key) => {
            fieldMap[key] = Form.createFormField({
              value: item[key],
            })
            return fieldMap
          }, {})
      else
        return columns.reduce((fieldMap, col) => {
          if (col.dataIndex && col.initValue)
            fieldMap[col.dataIndex] = Form.createFormField({
              value: col.initValue,
            })
          return fieldMap;
        }, {})
    }
  })
}
