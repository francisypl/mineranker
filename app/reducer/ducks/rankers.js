import debug from 'debug';
import _ from 'underscore';

const log = debug('reducer:ducks:rankers');

const RANKERS_FETCHING = '@post/FETCHING_RANKERS';
const RANKERS_FETCHED = '@post/FETCHED_RANKERS';
const RANKERS_FETCH_ERR = '@post/FETCHING_RANKERS_ERROR';

const initialState = {
    currentRankers: ['590f93a4d809d40011b5ca67'],
    richRankers: [],
    isWorking: false,
    hasError: false,
    error: undefined
};

export function getRankersByIds(api, rankerIds) {
    return async function(dispatch) {
        dispatch({type: RANKERS_FETCHING, payload: {}});

        try {
            const reqs = _.map(rankerIds, rankerId => {
                return api.fetchRankerById(rankerId);
            });
            const richRankers = await Promise.all(reqs);
            dispatch({type: RANKERS_FETCHED, payload: richRankers});
        }
        catch(e) {
            dispatch({type: RANKERS_FETCH_ERR, payload: e});
        }
    };
}

export default function reducer(state = initialState, action) {
    const {type, payload} = action;

    log('[reducer] processing payload');

    switch (type) {
    case RANKERS_FETCHING:
        {
            return {
                ...state,
                isWorking: true
            };
        }

    case RANKERS_FETCHED:
        {
            const richRankers = payload;
            return {
                ...state,
                isWorking: false,
                richRankers
            };
        }

    case RANKERS_FETCH_ERR:
        {
            const error = 'There was a problem while fetching rankers. Please try again.';
            return {
                ...state,
                isWorking: false,
                hasError: true,
                error
            };
        }

    default:
        {
            return state;
        }
    }
}
