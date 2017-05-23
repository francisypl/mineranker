import debug from 'debug';

const log = debug('reducer:ducks:miners');

const MINERS_FETCHING = '@post/FETCHING_MINERS';
const MINERS_FETCHED = '@post/FETCHED_MINERS';
const MINERS_FETCH_ERR = '@post/FETCHING_MINERS_ERROR';

export function getAllMiners() {
    return async function(dispatch) {
        log('[getAllMiners] attempting to fetch miners');

    };
}

const initialState = {
    currentMiners: [
        '5900d2cf0b9c9157e66e5f56', '5900fbc638675e6d72747b45'
    ],
    miners: [],
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
            const miners = payload.miners;

            return {
                ...state,
                isWorking: false,
                miners
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
