import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import post from './ducks/post';
import miners from './ducks/miners';
import rankers from './ducks/rankers';

export default combineReducers({
    post,
    miners,
    rankers,
    routing: routerReducer
});
