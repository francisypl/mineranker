/* @flow */

import request from 'superagent'

function getUrl (path: string): string {
  const url = process.env.MINERANKER_API_URL
    ? process.env.MINERANKER_API_URL
    : window.location.origin

  return `${url}${path}`
}

export function fetchPosts (lastId: string): Promise<Object> {
  // if (!process.env.MINERANKER_API_TOKEN) {
    // throw new Error('Mineranker API token not specified')
  // }

  return new Promise((resolve, reject) => (
    // @todo - remove, only for testing purposes
    resolve([
      {
        _id: 'abc',
        description: 'React Native has come a long way since it was open-sourced in 2015. Fewer than two years later, it’s being used not only in Facebook and Facebook Ads Manager, but also in many other companies, from Fortune 500 companies to hot new startups',
        downvote: 24,
        og_image_url: 'https://placekitten.com/g/600/300',
        source: 'new york times',
        title: 'React Native at Instagram',
        upvote: 142,
        url: 'https://example.com/',
      },
      {
        _id: 'xyz',
        description: 'When the company behind RethinkDB shut down last year, a group of former employees and members of the community formed an interim leadership team and began devising a plan to perpetuate the RethinkDB...',
        downvote: 11,
        og_image_url: 'https://placekitten.com/g/600/300',
        source: 'new york times',
        title: 'Rethink DB joins The Linux Foundation',
        upvote: 234,
        url: 'https://example.com/',
      }
    ])

    // request
      // .get(getUrl('/story'))
      // .query({ last_id: lastId })
      // .set('Content-Type', 'application/json')
      // .end((err, res) => {
        // return err ? reject(err) : resolve(res.body)
      // })
  ))
}
