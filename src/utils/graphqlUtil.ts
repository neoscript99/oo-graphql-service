import isObject from 'lodash/isObject';
import { BatchHttpLink } from 'apollo-link-batch-http';
import ApolloClient from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { PageInfo } from '../DomainStore';
import { Criteria, CriteriaOrder } from '../DomainGraphql';

/**
 * 设置 credentials: 'include' , 调用的fetch接口会带上cookie，可以保持session
 * @param fetchParams
 */
export function createApolloClient(fetchParams: BatchHttpLink.Options): ApolloClient<NormalizedCacheObject> {
  //WEB环境用浏览器原生fetch
  const link = new BatchHttpLink({ credentials: 'include', ...fetchParams });
  const cache = new InMemoryCache();
  return new ApolloClient({ link, cache });
}

/**
 * 转换为gorm的分页模式
 *
 * @param criteria
 * @param currentPage
 * @param pageSize
 * @see org.grails.datastore.gorm.query.criteria.AbstractDetachedCriteria
 */

export function processCriteriaPage(criteria: Criteria, pageInfo: PageInfo): Criteria {
  //AbstractDetachedCriteria中的分页函数为max和offset
  criteria.max = pageInfo.pageSize;
  criteria.offset = (pageInfo.currentPage - 1) * pageInfo.pageSize;
  return criteria;
}

/**
 * 将字符串嵌套排序字段转化为gorm可处理的格式
 * @param param 传入是为了在原参数上做增量修改，如:
 *  processOrderParam({user:{eq:[['name','admin']]}},[['user.age','desc']])=>{user:{eq:[['name','admin']],order:[['age','desc']]}}
 * @param orders
 */
export function processCriteriaOrder(criteria: Criteria, orders: CriteriaOrder[]) {
  //嵌套字段的排序criteria
  const orderList = orders.reduce(
    (notNestOrders, order) => {
      if (typeof order === 'string') order = [order, 'asc'];
      if (order[0].indexOf('.') === -1) notNestOrders.push(order);
      else {
        //['user.age','desc']=>['user','age']
        const nestFields: string[] = order[0].split('.');
        //order = ['age','desc']
        order[0] = nestFields[nestFields.length - 1];

        let parentParam = criteria;
        nestFields.slice(0, -1).forEach(field => {
          if (!parentParam[field]) parentParam[field] = {};
          parentParam = parentParam[field] as Criteria;
        });

        if (parentParam.order) parentParam.order.push(order);
        else parentParam.order = [order];
      }
      return notNestOrders;
    },
    [] as CriteriaOrder[],
  );
  if (orderList.length > 0) criteria.order = orderList;
}

/**
 * apollo-client默认支持fetch api，但各类小程序、react native不支持fetch
 * 本方法目前支持，后续可加入新的支持：
 *     Taro.request，等同于wx.request
 */
interface SomeFetch {
  (url: string, options: any): Promise<any>;
}

export function toFetch({ taroRequest, defaultOptions }: any): SomeFetch | null {
  if (taroRequest)
    return (url: string, { body: data, ...fetchOptions }: any) => {
      //Taro.request默认会对res做JSON.parse，但apollo-http-link需要text，也要做一次JSON.parse
      //所以要让微信返回text,需做如下配置：dataType: 'txt', responseType: 'text'
      //dataType	String	否	json	如果设为json，会尝试对返回的数据做一次 JSON.parse
      //responseType	String	否	text	设置响应的数据类型。合法值：text、arraybuffer
      return taroRequest({ url, data, ...defaultOptions, ...fetchOptions, dataType: 'txt', responseType: 'text' }).then(
        (res: any) => {
          res.text = () => Promise.resolve(res.data);
          return res;
        },
      );
    };
  else return null;
}

/**
 * 删除对象中的部份属性，满足graphql新增、更新字段要求
 * @param obj
 */
export function pureGraphqlObject(obj: any): any {
  obj.errors = undefined;
  obj.__typename = undefined;
  obj.lastUpdated = undefined;
  obj.dateCreated = undefined;
  Object.values(obj).forEach(value => isObject(value) && pureGraphqlObject(value));
  return obj;
}

export function clearEntity(entity: any, ...deleteProps: string[]) {
  const { id, lastUpdated, dateCreated, version, errors, ...rest } = entity;
  deleteProps.every(prop => delete rest[prop]);
  return rest;
}
