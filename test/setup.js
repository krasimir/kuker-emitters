import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiSubset from 'chai-subset';

chai.config.truncateThreshold = 0;

global.expect = expect;
global.sinon = sinon;

chai.use(sinonChai);
chai.use(chaiSubset);
