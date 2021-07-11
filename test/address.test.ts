import {flattenAddress} from '../src'
test('test Autocomplete', () => {
    const result = flattenAddress()
    expect(typeof result).toBe('object')
  })