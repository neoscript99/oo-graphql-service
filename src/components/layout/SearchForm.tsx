import React, { Component, KeyboardEvent } from 'react';
import { Form, Input } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form';

export interface SearchFormProps {
  form: WrappedFormUtils
  onSearch: () => void
}

/**
 * 接收一个form属性
 */
export class SearchForm<P extends SearchFormProps = SearchFormProps> extends Component<P> {
  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form layout="inline">
        <Form.Item>
          {getFieldDecorator('searchKey')(
            <Input placeholder='系统名、系统编码或根路径' onKeyDown={this.searchOnEnter.bind(this)}/>
          )}
        </Form.Item>
      </Form>
    );
  }

  searchOnEnter(e: KeyboardEvent<any>) {
    const { onSearch } = this.props;
    if (e.keyCode === 13) {
      e.stopPropagation()
      onSearch()
    }
  }
}
