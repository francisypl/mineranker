import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import post from './ducks/post';

export default combineReducers({
    post,
    routing: routerReducer
});
