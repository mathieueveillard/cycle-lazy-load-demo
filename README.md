# cycle-lazy-load-demo

An example of project using [Cycle.js](https://github.com/cyclejs/cyclejs) and [cycle-lazy-load](https://github.com/mathieueveillard/cycle-lazy-load)

## Install and launch

```
git clone https://github.com/mathieueveillard/cycle-lazy-load-demo.git && cd cycle-lazy-load-demo
```

API

```
cd api && npm i && npm start
```

SPA

```
cd spa && npm i && npm start
```

Then open dev tools and look at the "Network" tab. Play with settings and see how it affects the XHR requests to the back-end.

## Back-end / API

A simple [Express.js](http://expressjs.com/fr/)-based application exposing a REST API. This API mocks an ElasticSearch database which allows [search_after](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-search-after.html) queries.

The following request

```
curl http://localhost:3000/data/_search -X POST -H "Content-Type: application/json" -d '{ "size": 10, "search_after": [10000] }'
```

would return

```json
[
  {
    "id": "69ddd9dc-ae2a-49ef-b170-71377acf4e58",
    "body": "All work and no play makes Jack a dull boy.",
    "sort": [10001]
  },
  {
    "id": "228bbf7a-3350-4c6c-8d1f-59e0a47ff1e7",
    "body": "All work and no play makes Jack a dull boy.",
    "sort": [10002]
  },
  {
    "id": "5f4e1198-345d-4534-bef4-be6f63cac15e",
    "body": "All work and no play makes Jack a dull boy.",
    "sort": [10003]
  },
  {
    "id": "e651782f-4d2e-43f1-8a49-1194199a1316",
    "body": "All work and no play makes Jack a dull boy.",
    "sort": [10004]
  },
  {
    "id": "0b2c00de-ee43-4ae3-b196-b5d59f17a919",
    "body": "All work and no play makes Jack a dull boy.",
    "sort": [10005]
  },
  {
    "id": "6faabb4d-95aa-4ae6-ad57-40da78330b80",
    "body": "All work and no play makes Jack a dull boy.",
    "sort": [10006]
  },
  {
    "id": "1fbcd3f8-eda3-40e8-890e-01fb3ccb27bd",
    "body": "All work and no play makes Jack a dull boy.",
    "sort": [10007]
  },
  {
    "id": "e7aa3086-71fd-4a3a-8c62-30411cbe3546",
    "body": "All work and no play makes Jack a dull boy.",
    "sort": [10008]
  },
  {
    "id": "a35c4ab8-6fbf-46cb-8f63-7319b9bca07e",
    "body": "All work and no play makes Jack a dull boy.",
    "sort": [10009]
  },
  {
    "id": "0df0bde3-ac3f-47b9-870c-2187bce3dc71",
    "body": "All work and no play makes Jack a dull boy.",
    "sort": [100010]
  }
]
```

## Front-end / SPA

A [Cycle.js](https://cycle.js.org/) application.
