/* eslint-disable no-unused-vars, no-undef */
import { MobXEmitter } from '../';
import { spy, reaction, observable, extendObservable } from 'mobx';

describe('Given the MobXEmitter', function () {
  beforeEach(() => {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(() => {
    window.top.postMessage.restore();
  });
  describe('and when we dispatch an event', function () {
    it('should dispatch an event to Kuker extension', function () {
      const handler = sinon.spy();

      class Person {
        constructor() {
          extendObservable(this, {
            firstName: 'Matt',
            lastName: 'Ruby',
            age: 0
          });
        }
      }

      const person = new Person();

      reaction(function () {
        return person.firstName + ' ' + person.age;
      }, handler);

      MobXEmitter(spy, [ person ]);

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
