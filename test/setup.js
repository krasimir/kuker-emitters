const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiSubset = require('chai-subset');

chai.config.truncateThreshold = 0;

global.sinon = sinon;

global.jestExpect = global.expect;
global.expect = expect;
global.chai = chai;

chai.use(sinonChai);
chai.use(chaiSubset);
