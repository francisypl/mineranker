import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import post from './ducks/post';
import miners from './ducks/miners';

export default combineReducers({
    post,
    miners,
    routing: routerReducer
});
