import React, { ReactNode } from 'react'
import moment, { max } from 'moment';
import numeral from 'numeral';
import { PaginationConfig } from 'antd/lib/table';
import { PageInfo } from '../DomainStore';
import { wordBreakText, hiddenText } from './styleUtil';

export function timeFormater(date: Date): string {
  return moment(date)
    .format('YYYY-MM-DD hh:mm')
}

export function booleanLabel(value: boolean): string {
  return value ? '是' : '否'
}

export function numberLabel(value?: number): ReactNode {
  return value ? numeral(value)
    .format('0,0') : null;
}

export function numberColorLabel(value?: number): ReactNode {
  if (value) {
    const color = value >= 0 ? 'red' : 'green'
    return <span style={{ color, whiteSpace: 'nowrap' }}>
    {value < 0 && '↓'}{value > 0 && '↑'} {numeral(value)
      .format('0,0')}
    </span>
  } else
    return null
}

export function hiddenTextRender(maxSize: number, value: string) {
  const HiddenText = hiddenText(maxSize)
  return <HiddenText>{value}</HiddenText>
}

export function wordBreakTextRender(maxSize: number, value: string) {
  const BreakText = wordBreakText(maxSize)
  return <BreakText>{value}</BreakText>
}

export const commonColumnRenders = { booleanLabel, timeFormater, numberLabel, numberColorLabel }

export function toPageInfo(pagination: PaginationConfig): PageInfo {
  return {
    currentPage: pagination.current || 1,
    pageSize: pagination.pageSize || 10,
    totalCount: pagination.total
  }
}

export function fromPageInfo(pageInfo: PageInfo): PaginationConfig {
  return {
    current: pageInfo.currentPage || 1,
    pageSize: pageInfo.pageSize || 10,
    total: pageInfo.totalCount
  }
}

export const commonColumns = {
  enabled: { title: '是否启用', dataIndex: 'enabled', render: booleanLabel },
  editable: { title: '可编辑', dataIndex: 'editable', render: booleanLabel },
  lastUser: { title: '修改人', dataIndex: 'lastUser.name' },
  lastUpdated: { title: '修改时间', dataIndex: 'lastUpdated', render: timeFormater }
}


export function numberSort(dataIndex: string, a: any, b: any) {
  return a[dataIndex] - b[dataIndex];
}

export const commonSortFunctions = { numberSort }
