import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import post from './ducks/post'
import video from './ducks/video'

export default combineReducers({
  post,
  video,
  routing: routerReducer
})
