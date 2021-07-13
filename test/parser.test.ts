import {ParseNIK} from '../src'

test('test parseNIK', () => {
  const parse = new ParseNIK('3301110101110002')
  expect(parse.isValid()).toBe(true)
  expect(typeof parse.parse()).toBe('object')
})