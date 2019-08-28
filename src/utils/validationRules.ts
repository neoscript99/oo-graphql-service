import { ValidationRule } from 'antd/lib/form';

export const commonRules: { [key: string]: ValidationRule } = {
  required: { required: true, message: '不能为空!' },
  json: { pattern: /^{(.*:.*)*}$/, message: '请输入Json格式的字符串' }
}
