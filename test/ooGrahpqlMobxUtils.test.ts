import { pureGraphqlObject } from '../src/ooGrahpqlMobxUtils';

describe('pureGraphqlObject', () => {

  it('pureGraphqlObject', () => {
    let obj = { a: 1, errors: [1, 2, 3], __typename: 'exist' }
    expect(pureGraphqlObject(obj).errors)
      .toBeUndefined();
  });

});
