import {ParseNIK} from '../src'

test('test parseNIK', () => {
  const parse = new ParseNIK('3301110101110002', 'test')
  console.log(parse);
  
  expect(parse.isValid()).toBe(true)
  expect(typeof parse.parse()).toBe('object')
})