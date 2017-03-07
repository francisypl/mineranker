/* @flow */

import debug from 'debug'
import type { Dispatch } from 'redux'

const log = debug('reducer:ducks:post')

type State = {|
  hasError: boolean,
  error?: string,
  isWorking: boolean,
  posts: Array<PostType>,
  lastId: string,
  loadMoreThreshold: number,
|}

const POST_FETCHING  = '@post/FETCHING_POSTS'
const POST_FETCHED   = '@post/FETCHED_POSTS'
const POST_FETCH_ERR = '@post/FETCHING_POSTS_ERROR'

export function getPosts (lastId: string = '0', api: Api) {
  return async function (dispatch: Dispatch) {
    log('[getPosts] attempting to fetch posts')

    dispatch({ type: POST_FETCHING, payload: { lastId } })

    try {
      const posts = await api.fetchPosts(lastId)
      dispatch({ type: POST_FETCHED, payload: { posts } })
    } catch (e) {
      dispatch({ type: POST_FETCH_ERR, payload: e })
    }
  }
}

const initialState = {
  hasError: false,
  error: undefined,
  isWorking: false,
  posts: [],
  lastId: '0',
  loadMoreThreshold: 4,
}

export default function reducer (state: State = initialState, action: Action) {
  const { type, payload } = action

  log('[reducer] processing payload')

  switch (type) {
    case POST_FETCHING: {
      return { ...state, isWorking: true }
    }

    case POST_FETCHED: {
      const { posts } = payload
      // Make sure any http link we get is transformed to an https link
      const formattedPosts = posts.map((post) => {
        const httpsUrl = post.og_image_url.replace(/^http:/, 'https:')
        return {
          ...post,
          og_image_url: httpsUrl,
        }
      })
      // Get the last id from the list of latest posts
      const lastId = formattedPosts.length ? formattedPosts[formattedPosts.length - 1]._id : state.lastId
      return {
        ...state,
        isWorking: false,
        posts: state.posts.concat(formattedPosts),
        lastId,
      }
    }

    case POST_FETCH_ERR: {
      // Make error message friendly
      const error = 'There was a problem while processing your request. Please try again.'
      return { ...state, isWorking: false, hasError: true, error }
    }

    default: {
      return state
    }
  }
}
