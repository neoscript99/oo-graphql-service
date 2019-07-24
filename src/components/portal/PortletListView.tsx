import React from 'react';
import urlTemplate from 'url-template'
import { Card, Table } from 'antd';
import { dateStringConvert } from '../../utils/stringUtil';
import { ColumnProps } from 'antd/lib/table';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { Portlet } from './Portlet';
import { Entity } from '../../DomainStore';
import stringTemplate from 'string-template'

export class PortletListView extends Portlet {
  render() {
    if (!(this.state && this.state.portlet))
      return null;
    const { inTab } = this.props;
    const { portlet, dataList } = this.state
    const { portletName, rowKey, extraLink } = this.state.portlet;

    const extraLinkA = extraLink && <a href={extraLink} target='_blank'>更多</a>;
    const Content = <Table dataSource={dataList} columns={this.getColumns(portlet)}
                           rowKey={rowKey} pagination={false} showHeader={false} size='middle' bordered={false}
                           footer={inTab ? (() => <div style={{
                             textAlign: 'right',
                             backgroundColor: 'inherit'
                           }}>{extraLinkA}</div>) : undefined} />
    return inTab ? Content :
      <Card title={portletName} extra={extraLinkA}>
        {Content}
      </Card>
  }

  private getColumns(portlet: Entity) {
    const {
      titleTemplate, titleWhiteSpace, cateField, dateField, fromDateFormat, titleLink, toDateFormat
    } = portlet;
    const linkTemplate = urlTemplate.parse(titleLink)
    const columns: ColumnProps<Entity>[] = [
      {
        title: 'category',
        dataIndex: cateField,
        render: (text: string) => `[${text}]`,
        fixed: 'left'
      },
      {
        title: 'title',
        key: 'titleFields',
        render: (text: string, record: any) =>
          <a href={linkTemplate.expand(record)} target="_blank"
             style={{ whiteSpace: titleWhiteSpace }}>
            {stringTemplate(titleTemplate, record)}
          </a>
      },
      {
        title: 'date',
        dataIndex: dateField,
        align: 'right',
        render: dateStringConvert.bind(null, fromDateFormat, toDateFormat),
        fixed: 'right'
      }
    ]
    return columns.filter(col => cateField || col.title !== 'category');
  }

  get portletService(): DomainService<MobxDomainStore> {
    return this.props.services.portletListViewService;
  }
}
