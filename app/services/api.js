import request from 'superagent';

function getUrl(path) {
    const url = process.env.MINERANKER_API_URL
        ? process.env.MINERANKER_API_URL
        : window.location.origin;

    return `${url}${path}`;
}

export function fetchRankerById(rankerId) {
    return new Promise((resolve, reject) => {
        request.get(getUrl(`/api/v1/rankers/${rankerId}`))
        .set('Content-Type', 'application/json')
        .end((err, res) => {
            return err
                ? reject(err)
                : resolve(res.body);
        });
    });
}

export function fetchMinerById(minerId) {
    return new Promise((resolve, reject) => {
        request.get(getUrl(`/api/v1/miners/${minerId}`))
        .set('Content-Type', 'application/json')
        .end((err, res) => {
            return err
                ? reject(err)
                : resolve(res.body);
        });
    });
}

export function fetchPosts(pagination, miners, rankers) {
    let query = {
        limit: 30,
        miners: miners.join(),
        rankers: rankers.join()
    };

    if (pagination !== '') {
        query.pagination = pagination;
    }

    return new Promise((resolve, reject) => (
        request.get(getUrl('/api/v1/story'))
        .query(query).set('Content-Type', 'application/json')
        .end((err, res) => {
            return err
                ? reject(err)
                : resolve(res.body);
        })
    ));
}
