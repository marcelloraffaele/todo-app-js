const editableFields = ['description', 'category', 'expirationDate', 'state'];

function getTodoUpdates(updates) {
    return Object.fromEntries(
        editableFields
            .filter(field => Object.hasOwn(updates, field))
            .map(field => [field, updates[field]])
    );
}

module.exports = { getTodoUpdates };
