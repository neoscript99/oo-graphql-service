import styled from 'styled-components';
export function hiddenText(maxSize:number){
 return styled.p`
    white-space: nowrap;
    overflow: hidden;
    width: ${maxSize}em;
    text-overflow: ellipsis;
    margin: 0;
    :hover {
      overflow: visible;
      white-space: normal;
      overflow-wrap: break-word;
    }`
}

export function wordBreakText(maxSize:number){
 return styled.p`
    width: ${maxSize}em;
    margin: 0;
    white-space: normal;
    overflow-wrap: break-word;`
}
