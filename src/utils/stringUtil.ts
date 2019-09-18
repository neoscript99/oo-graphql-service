import moment from 'moment';

export namespace StringUtil {
  export function dateStringConvert(fromDateFormat: string, toDateFormat: string, text: string) {
    if (text && fromDateFormat && toDateFormat)
      return moment(text, fromDateFormat)
        .format(toDateFormat)
    else
      return text
  }

  export function isNotBlank(value: string | null | undefined): boolean {
    return (value && value.trim().length > 0) ? true : false
  }

  export function isBlank(value: string | null | undefined): boolean {
    return !isNotBlank(value)
  }
}
