import { ValidationRule } from 'antd/lib/form';

/** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
export const commonRules: { [key: string]: ValidationRule } = {
  required: { required: true, whitespace: true, message: '不能为空!' },
  json: { pattern: /^\{(\".+\":.+\,?)*\}$/, message: '请输入Json格式的字符串，例如：{"user":"one","on":true}' },
};
