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
      titleTemplate, titleWhiteSpace, titleMaxSize, cateField, dateField, fromDateFormat, titleLink, toDateFormat
    } = portlet;
    const linkTemplate = titleLink && urlTemplate.parse(titleLink)
    const columns: ColumnProps<Entity>[] = [
      {
        title: 'title',
        key: 'titleFields',
        render: (text: string, record: any) => {
          const titleStr: string = titleTemplate && stringTemplate(titleTemplate, record);
          return (
            <a href={titleLink ? linkTemplate.expand(record) : '#'} target="_blank"
               style={{ whiteSpace: titleWhiteSpace }}>
              {(titleMaxSize && titleMaxSize > 0)
                ? <p style={{ width: titleMaxSize + 'em', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                  {titleStr}
                </p>
                : titleStr
              }
            </a>)
        }
      }
    ]
    if (cateField)
      columns.push({
        title: 'category',
        dataIndex: cateField,
        render: (text: string) => `[${text}]`,
        fixed: 'left'
      });
    if (dateField)
      columns.push(
        {
          title: 'date',
          dataIndex: dateField,
          align: 'right',
          render: dateStringConvert.bind(null, fromDateFormat, toDateFormat),
          fixed: 'right'
        })
    return columns
  }

  get portletService(): DomainService<MobxDomainStore> {
    return this.props.services.portletListViewService;
  }
}
