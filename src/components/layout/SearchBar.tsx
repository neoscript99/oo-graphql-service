import React, { Component, CSSProperties } from 'react';
import { Button, Form } from 'antd';
import { SearchForm } from './SearchForm';
import { FormComponentProps } from 'antd/lib/form';

export interface SearchFromBarProps extends FormComponentProps {
  onSearch: (searchParam: any) => void;
  searchForm: typeof SearchForm;
  searchParam: any;
}

const buttonCss: CSSProperties = {
  marginLeft: '0.5rem',
};

class SearchFromBar extends Component<SearchFromBarProps> {
  render() {
    const { form, searchForm: SearchFormComponent } = this.props;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <SearchFormComponent form={form} onSearch={this.handleSearch.bind(this)} />
        <Button icon="search" type="primary" style={buttonCss} title="查询" onClick={this.handleSearch.bind(this)} />
        <Button icon="reload" style={buttonCss} title="重置" onClick={this.handleReset.bind(this)} />
      </div>
    );
  }

  handleSearch() {
    const { form, onSearch } = this.props;
    form.validateFields((err, searchParam) => err || onSearch(searchParam));
  }

  handleReset() {
    const { form, onSearch } = this.props;
    form.resetFields();
    onSearch(null);
  }
}

export const SearchBar = Form.create({
  name: `SearchBarFrom${new Date().toISOString()}`,
  mapPropsToFields(props: SearchFromBarProps) {
    const { searchParam } = props;
    return (
      searchParam &&
      Object.keys(searchParam).reduce((fieldMap, key) => {
        fieldMap[key] = Form.createFormField({
          value: searchParam[key],
        });
        return fieldMap;
      }, {})
    );
  },
})(SearchFromBar);
