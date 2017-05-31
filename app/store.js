import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {hashHistory} from 'react-router';
import {routerMiddleware} from 'react-router-redux';

import reducer from './reducer';

const enhancer = compose(
    applyMiddleware(
        routerMiddleware(hashHistory),
        thunk,
        logger()
    )
);

export default createStore(reducer, {}, enhancer);
