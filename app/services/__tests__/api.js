import * as api from './../api'

describe('API Service', () => {
  it('contains function fetchPosts', () => {
    expect(api.fetchPosts instanceof Function).toBe(true)
  })
})
