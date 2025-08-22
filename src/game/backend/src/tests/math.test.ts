function add(a, b) {
  return a + b;
}

test("adds two numbers", () => {
  expect(add(2, 3)).toBe(5);
});

test("works with negative numbers", () => {
  expect(add(-1, -2)).toBe(-3);
});
