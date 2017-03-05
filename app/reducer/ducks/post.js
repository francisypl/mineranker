/* @flow */

import debug from 'debug'
import type { Dispatch } from 'redux'

const log = debug('reducer:ducks:post')

type State = {|
  hasError: boolean,
  query: string,
  error?: string,
  isWorking: boolean,
  posts: Array<PostType>,
  lastId: string,
  loadMoreThreshold: number,
|}

export function getPosts (lastId: string = '0', api: Api) {
  return async function (dispatch: Dispatch) {
    log('[getPosts] attempting to fetch posts')

    dispatch({ type: '@post/FETCHING_POSTS', payload: { lastId } })

    try {
      const posts = await api.fetchPosts(lastId)
      dispatch({ type: '@post/FETCHED_POSTS', payload: { posts } })
    } catch (e) {
      dispatch({ type: '@post/FETCHING_POSTS_ERROR', payload: e })
    }
  }
}

export function search (query: string, lastId: string, api: Api) {
  return async function (dispatch: Dispatch) {
    log('[search] attempting to search brand posts')

    dispatch({ type: '@post/SEARCHING_POSTS', payload: { query, lastId } })

    try {
      const posts = await api.searchBrands(query, lastId)
      dispatch({ type: '@post/SEARCHED_POSTS', payload: { posts } })
    } catch (e) {
      dispatch({ type: '@post/SEARCHING_POSTS_ERROR', payload: e })
    }
  }
}

export function clearSearch (): Action {
  return { type: '@post/CLEAR_SEARCH', payload: {} }
}

const initialState = {
  hasError: false,
  error: undefined,
  isWorking: false,
  posts: [],
  lastId: '0',
  query: '',
  loadMoreThreshold: 4,
}

export default function reducer (state: State = initialState, action: Action) {
  const { type, payload } = action

  log('[reducer] processing payload')

  switch (type) {
    case '@post/FETCHING_POSTS': {
      return { ...state, isWorking: true }
    }

    case '@post/SEARCHED_POSTS':
    case '@post/FETCHED_POSTS': {
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

    case '@post/SEARCHING_POSTS_ERROR':
    case '@post/FETCHING_POSTS_ERROR': {
      // Make error message friendly
      const error = 'There was a problem while processing your request. Please try again.'
      return { ...state, isWorking: false, hasError: true, error }
    }

    case '@post/SEARCHING_POSTS': {
      const { query, lastId } = payload
      return { ...state, isWorking: true, lastId, query }
    }

    case '@post/CLEAR_SEARCH': {
      return { ...state, isWorking: false, posts: [], lastId: '0', query: '' }
    }

    default: {
      return state
    }
  }
}
