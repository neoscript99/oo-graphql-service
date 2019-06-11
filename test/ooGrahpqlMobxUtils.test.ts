import { processCriteriaOrder, pureGraphqlObject } from '../src/ooGrahpqlMobxUtils';
import { Criteria, CriteriaOrder } from '../src/DomainGraphql';

describe('pureGraphqlObject', () => {

  it('pureGraphqlObject', () => {
    let obj = { a: 1, errors: [1, 2, 3], __typename: 'exist' }
    expect(pureGraphqlObject(obj).errors)
      .toBeUndefined();
  });

  it('string index', () => {
    const pstr = 'name';
    console.log(pstr[0])
    expect(pstr[0].indexOf('.'))
      .toEqual(-1)
  });

  it('processCriteriaOrder test', () => {
    const criteria: Criteria = {};
    const orders: CriteriaOrder[] = ['aa', ['bb', 'desc'], ['cc.name', 'asc']]
    processCriteriaOrder(criteria, orders)
    console.debug(criteria)
    expect(criteria)
      .toEqual({ order: [['aa', 'asc'], ['bb', 'desc']], cc: { order: [['name', 'asc']] } })

    const criteria2: Criteria = {}
    processCriteriaOrder(criteria2, ['portal.seq', 'rowOrder'])
    console.debug(criteria2)
    expect(criteria2)
      .toEqual({ order: [['rowOrder', 'asc']], portal: { order: [['seq', 'asc']] } })
  })
});
