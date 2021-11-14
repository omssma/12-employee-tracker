const inputTest = require('../utils/inputTest');

test('inputTest() returns null when all properties exist', () => {
  const obj = {name: 'alice'};

  expect(inputTest(obj, 'name')).toBe(null);
});

test('inputTest() returns an object when a property is missing', () => {
  const obj = {name: 'alice', occupation: ''};

  expect(inputTest(obj, 'name', 'occupation')).toEqual(
    expect.objectContaining({
      error: expect.stringContaining('No occupation specified')
    })
  );
});