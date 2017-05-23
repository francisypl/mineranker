import debug from 'debug';

const log = debug('reducer:ducks:rankers');

const RANKERS_FETCHING = '@post/FETCHING_RANKERS';
const RANKERS_FETCHED = '@post/FETCHED_RANKERS';
const RANKERS_FETCH_ERR = '@post/FETCHING_RANKERS_ERROR';

const initialState = {
    currentRankers: ['590a1ead2bd9c4b630e27570'],
    rankers: [],
    isWorking: false,
    hasError: false,
    error: undefined
};

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
            const rankers = payload.rankers;
            return {
                ...state,
                isWorking: false,
                rankers
            };
        }

    case RANKERS_FETCH_ERR:
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
