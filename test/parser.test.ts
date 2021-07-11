import {parseNIK} from '../src'

test('test parseNIK', () => {
  const parse = parseNIK('3301110101110002')
  expect(parse.validate()).toBe(true)
})