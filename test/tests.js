const inspect = (obj) => console.log(require('util').inspect(obj, { depth: null }));
const expect = require('chai').expect;
const props = require('../lib/utils').default;

describe('hello-world', () => {
  it('works', () => {
    expect(props).to.be.an.object;
    expect(props.name).to.equal('friend');
  });
});