
import { expect } from 'chai';

import * as props from '../src/js/utils';

describe('hello-world', () => {
  it('works', () => {
    // expect(props.default.name).to.be.an.object;
    expect(props.default.name).to.equal('friend');
  });
});
