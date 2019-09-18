import React from 'react';
import urlTemplate from 'url-template'
import { Card, Table } from 'antd';
import { StringUtil } from '../../utils/stringUtil';
import { ColumnProps } from 'antd/lib/table';
import { DomainService } from '../../DomainService';
import { MobxDomainStore } from '../../mobx';
import { Portlet } from './Portlet';
import { Entity } from '../../DomainStore';
import stringTemplate from 'string-template'
import styled from 'styled-components';
import { hiddenText } from '../../utils';

const { dateStringConvert } = StringUtil

export class PortletListView extends Portlet {
  render() {
    if (!(this.state && this.state.portlet))
      return null;
    const { inTab } = this.props;
    const { portlet, dataList } = this.state
    const { portletName, titleWhiteSpace, titleMaxSize, rowKey, extraLink } = this.state.portlet;

    const extraLinkA = extraLink && <a href={extraLink} target='_blank'>更多</a>;
    const TitleText = titleMaxSize
      ? hiddenText(titleMaxSize)
      : styled.p`
    white-space: ${titleWhiteSpace};
    margin: 0;`;

    const ContentDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    `
    const Content = <ContentDiv>
      <Table dataSource={dataList} columns={this.getColumns(portlet, TitleText)}
             rowKey={rowKey} pagination={false} showHeader={false} size='middle'
             bordered={false} />
      {inTab && <div style={{ textAlign: 'right', margin: '1rem 1rem 0 0' }}>{extraLinkA}</div>}
    </ContentDiv>

    return inTab ? Content :
      <Card title={portletName} extra={extraLinkA} style={this.props.style}>
        {Content}
      </Card>
  }

  private getColumns(portlet: Entity, TitleText: any) {
    const {
      titleTemplate, cateField, dateField, fromDateFormat, titleLink, toDateFormat
    } = portlet;
    const linkTemplate = titleLink && urlTemplate.parse(titleLink)
    const columns: ColumnProps<Entity>[] = [
      {
        title: 'title',
        key: 'titleFields',
        render: (text: string, record: any) => {
          const titleStr: string = titleTemplate && stringTemplate(titleTemplate, record);

          return (
            <a href={titleLink ? linkTemplate.expand(record) : '#'} target="_blank">
              <TitleText>{titleStr}</TitleText>
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
