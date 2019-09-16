import React, { Component } from 'react';
import { Button, Form } from 'antd';

export interface SearchBarProps {
  onSearch: () => void
  searchForm: React.ComponentType
}

export class SearchBar extends Component<SearchBarProps> {
  render() {
    const { searchForm } = this.props;
    const SearchForm = Form.create({ name: 'entity_search_form' })(searchForm);
    return <div style={{ display: 'flex' }}>
      <SearchForm />
      <Button title='查询' />
      <Button title='重置' />
    </div>;
  }
}
