/* @flow */

import request from 'superagent'

function getUrl (path: string): string {
  const url = process.env.MINERANKER_API_URL
    ? process.env.MINERANKER_API_URL
    : window.location.origin

  return `${url}${path}`
}

export function fetchPosts (lastId: string): Promise<Object> {
  let query = {
    limit: 30
  };

  if (lastId !== '0') {
    query.offset = lastId
  }

  return new Promise((resolve, reject) => (
    request
      .get(getUrl('/api/v1/story'))
      .query(query)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        return err ? reject(err) : resolve(res.body)
      })
  ))
}
