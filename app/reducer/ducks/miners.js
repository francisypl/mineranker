import debug from 'debug';
import _ from 'underscore';

const log = debug('reducer:ducks:miners');

const MINERS_FETCHING = '@post/FETCHING_MINERS';
const MINERS_FETCHED = '@post/FETCHED_MINERS';
const MINERS_FETCH_ERR = '@post/FETCHING_MINERS_ERROR';

export function getMinersByIds(api, minerIds) {
    return async function(dispatch) {
        dispatch({type: MINERS_FETCHING, payload: {}});

        try {
            const reqs = _.map(minerIds, rankerId => {
                return api.fetchMinerById(rankerId);
            });
            const richMiners = await Promise.all(reqs);
            dispatch({type: MINERS_FETCHED, payload: richMiners});
        }
        catch(e) {
            dispatch({type: MINERS_FETCH_ERR, payload: e});
        }
    };
}

const initialState = {
    currentMiners: [
        '5900d2cf0b9c9157e66e5f56', '5900fbc638675e6d72747b45'
    ],
    richMiners: [],
    isWorking: false,
    hasError: false,
    error: undefined
};

export default function reducer(state = initialState, action) {
    const {type, payload} = action;

    log('[reducer] processing payload');

    switch (type) {
    case MINERS_FETCHING:
        {
            return {
                ...state,
                isWorking: true
            };
        }

    case MINERS_FETCHED:
        {
            const richMiners = payload;

            return {
                ...state,
                isWorking: false,
                richMiners
            };
        }

    case MINERS_FETCH_ERR:
        {
            const error = 'There was a problem while processing your request. Please try again.';
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
