import request from 'superagent';

function getUrl(path) {
    const url = process.env.MINERANKER_API_URL
        ? process.env.MINERANKER_API_URL
        : window.location.origin;

    return `${url}${path}`;
}

export function fetchPosts(pagination) {
    // const miners = [
    //   '590f8811d809d40011b5c7b5',
    //   '590f8811d809d40011b5c7b4'
    // ];
    // const rankers = [
    //   '590f93a4d809d40011b5ca67'
    // ];
    // dev
    const miners = ['5900d2cf0b9c9157e66e5f56', '5900fbc638675e6d72747b45'];
    const rankers = ['590a1ead2bd9c4b630e27570'];
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
