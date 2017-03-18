Check out www.softwaredaily.com to see our implementation and deployment example.

# mineranker

Join our Slack: https://software-daily-slack.herokuapp.com/

## Description
Mineranker is the easiest and most extensible open source news feed platform ever created. Users can subscribe to or build their own miners (news source) and choose their own ranking algorithm to determine in what order or what stories from those miners to display. And as mentioned, there are two components to Mineranker: miners and rankers. Miners aggregate and enrich stories to be added to the Mineranker database. Rankers filter and sort stories to be displayed on each user’s personal news feed.

An example of a miner is the HackerNews miner: a HN miner can hit the HN API to get some skeleton data then it would enrich that data by scraping the url of the item and then put together a short summary of the article. This enriched story would then be added to the Mineranker database. An example of a ranker is the Upvote ranker: the upvote ranker can filter out anything that has less than 50 upvotes and sorts the stories by upvotes to display in descending order.

## Getting Started
The easiest place to get started is by tackling some of the issues on the issues tab. You can contribute with ideas or take on implementing a feature.

#### Set Up Dev Env:
- Download [MongoDb](https://docs.mongodb.com/getting-started/shell/installation/)
- Install Swagger globally: `npm install -g swagger`
- Run Mongo: `mongod`
- Install Dependencies: `npm install`
- Run API: `npm run dev`
- Run React App: `npm run compile:app:watch`
- See Swagger Docs: `npm run edit`

## Architecture
There are 3 major topics of architecture to be discussed: the Application Architecture, the Miner Architecture and the Ranker Architecture.

### Application Architecture
Mineranker is a web based application. Mineranker has a React/Redux web application that talks to an Application API (Restify Node API with a Swagger interface) and its data persists on a Mongo database.

### Miner Architecture
A Miner is free from any architectural restrictions. A miner can be built in any way shape or form, it just has to call the Application API to store enriched stories to the DB.

Example: [HackerNews Miner](https://github.com/francisypl/hackernews_miner)

### Ranker Architecture
The ranking will happen in the backend. Each user will have their own profile_config.json file. The profile_config.json file will contain a JSON representation of how the user want to ranker their stories. An example:

```json
{
    "user": {...},
    "ranker": {
        "filter": [
            {
                "upvote": {
                    "gte": 50
                }
            }
        ],
        "sort": [
            {
                "upvote": "asc"
            },
            {
                "description": {
                    "contains": "hello"
                }
            }
        ]
    }
}
```

Notice that the `filter` object and the `sort` object are both arrays. The Ranker module uses a pipe and filter design pattern to rank stories. Each element of the `filter` object is turned into a filter condition which each story must meet. In this example, `story.upvote` has to be greater than or equal to 50. If the story does not have an upvote key, that story is skipped. Each element of the `sort` object will sort the stories exactly once. In this example, stories are first sorted in ascending order by their upvote key’s values. It is then sorted by whether the story’s description key contains the string “hello”. The Ranker module will do the filtering first, and then the sorting.
