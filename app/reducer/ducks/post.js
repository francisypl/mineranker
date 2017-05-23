import debug from 'debug';
import _ from 'underscore';

const log = debug('reducer:ducks:post');

const POST_FETCHING = '@post/FETCHING_POSTS';
const POST_FETCHED = '@post/FETCHED_POSTS';
const POST_FETCH_ERR = '@post/FETCHING_POSTS_ERROR';

export function getPosts(pagination = '', api, miners, rankers) {
    return async function(dispatch) {
        log('[getPosts] attempting to fetch posts');

        debugger;
        dispatch({type: POST_FETCHING, payload: {pagination}});

        try {
            const storiesObj = await api.fetchPosts(pagination, miners, rankers);
            dispatch({type: POST_FETCHED, payload: storiesObj});
        }
        catch (e) {
            dispatch({type: POST_FETCH_ERR, payload: e});
        }
    };
}

const initialState = {
    hasError: false,
    error: undefined,
    isWorking: false,
    posts: [],
    pagination: '',
    loadMoreThreshold: 4
};

export default function reducer(state = initialState, action) {
    const {type, payload} = action;

    log('[reducer] processing payload');

    switch (type) {
    case POST_FETCHING:
        {
            return {
                ...state,
                isWorking: true
            };
        }

    case POST_FETCHED:
        {
            const stories = payload.stories;
            const pagination = payload.pagination;
            // Make sure any http link we get is transformed to an https link
            const formattedPosts = stories.map((post) => {
                let httpsUrl = '';
                if (_.has(post, 'og_image_url')) {
                    httpsUrl = post.og_image_url.replace(/^http:/, 'https:');
                }
                return {
                    ...post,
                    og_image_url: httpsUrl
                };
            });
            // Get the last id from the list of latest posts
            return {
                ...state,
                isWorking: false,
                posts: state.posts.concat(formattedPosts),
                pagination
            };
        }

    case POST_FETCH_ERR:
        {
            // Make error message friendly
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
