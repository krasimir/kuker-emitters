'use strict';

var _ = require('../');

var _mobx = require('mobx');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* eslint-disable no-unused-vars, no-undef */


describe('Given the MobXEmitter', function () {
  beforeEach(function () {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(function () {
    window.top.postMessage.restore();
  });
  describe('and when we dispatch an event', function () {
    it('should dispatch an event to Kuker extension', function () {
      var handler = sinon.spy();

      var Person = function Person() {
        _classCallCheck(this, Person);

        (0, _mobx.extendObservable)(this, {
          firstName: 'Matt',
          lastName: 'Ruby',
          age: 0
        });
      };

      var person = new Person();

      (0, _mobx.reaction)(function () {
        return person.firstName + ' ' + person.age;
      }, handler);

      (0, _.MobXEmitter)(_mobx.spy, [person]);

      person.age = 33;

      expect(person.age).to.be.equal(33);
      expect(handler).to.be.calledOnce.and.to.be.calledWith('Matt 33');

      expect(window.top.postMessage).to.be.calledWith(sinon.match({
        type: '@mobx_action',
        state: {
          Person: {
            age: 33, firstName: 'Matt', lastName: 'Ruby'
          }
        }
      }));
    });
  });
});