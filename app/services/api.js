/* @flow */

import request from 'superagent'

function getUrl (path: string): string {
  const url = process.env.MINERANKER_API_URL
    ? process.env.MINERANKER_API_URL
    : window.location.origin

  return `${url}${path}`
}

export function fetchPosts (pagination: string): Promise<Object> {
  const miners = [
    '5900fbc638675e6d72747b45',
    '5900d2cf0b9c9157e66e5f56'
  ];
  const rankers = [
    '590a1ead2bd9c4b630e27570'
  ];
  let query = {
    limit: 30,
    miners: miners.join(),
    rankers: rankers.join()
  };

  debugger;
  if (pagination !== '') {
    query.pagination = pagination
  }

  return new Promise((resolve, reject) => (
    request
      .get(getUrl('/api/v1/story'))
      .query(query)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        debugger;
        return err ? reject(err) : resolve(res.body)
      })
  ))
}
