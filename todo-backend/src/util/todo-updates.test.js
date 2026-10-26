const { getTodoUpdates } = require('./todo-updates');

describe('getTodoUpdates', () => {
    it('copies only editable own properties', () => {
        const updates = JSON.parse('{"description":"Updated","category":"test","expirationDate":null,"state":"done","id":42,"userId":"other","creationDate":"bad","__proto__":{"polluted":true},"constructor":{}}');
        expect(getTodoUpdates(updates)).toEqual({
            description: 'Updated', category: 'test', expirationDate: null, state: 'done'
        });
        expect(Object.getPrototypeOf(getTodoUpdates(updates))).toBe(Object.prototype);
    });

    it('does not copy inherited fields or add omitted fields', () => {
        const updates = Object.create({ description: 'inherited' });
        updates.state = 'canceled';
        expect(getTodoUpdates(updates)).toEqual({ state: 'canceled' });
    });
});
