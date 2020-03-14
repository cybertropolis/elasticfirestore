# ElasticFirestore

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ffe934184e4f45ec9c8dc315baf40b09)](https://www.codacy.com/manual/rafaelluisdacostacoelho/elasticfirestore?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=rafaelluisdacostacoelho/elasticfirestore&amp;utm_campaign=Badge_Grade)

A pluggable integration with ElasticSearch to provide advanced content searches in Firebase Cloud Firestore.

The ElasticFirestore is based the [Flashlight](https://github.com/FirebaseExtended/flashlight), but while the Flashlight work with Realtime Database, the ElasticFirestore works with Cloud Firestore.

This script can:
 - Monitor multiple Firebase paths and index data in real time.
 - Communicates with client completely via Firebase (client pushes search terms to `requests` and reads results from `responses`).
 - Clean up old, outdated requests.

## Getting Started

### Softwares

Tested on `NodeJS 10.13.0 LTS` for Windows x64.

### Set the environment variables

You must define the environment variables to run the elasticfirestore.

`CLEANUP_INTERVAL` defines a time in miliseconds to cleanup the responses, example `60000`.

`FIREBASE_URL` defines your Firebase App, example `https://your-app.firebaseapp.com`.
`FIREBASE_REQUEST` defines the request path where the query is stored and consumed by elasticsearch, example `requests`.
`FIREBASE_RESPONSE` defines the response path where the elasticsearch will store their query results, example `responses`.
`FIREBASE_SERVICE_ACCOUNT` defines the credentials from Firebase, download a json file from `https://console.firebase.google.com/project/your-app/settings/serviceaccounts/adminsdk`, example `service-account.json`.

`BONSAI_URL` (optional)  

`ELASTICSEARCH_REQUEST_TIMEOUT` (optional)  
`ELASTICSEARCH_MAX_SOCKETS` (optional)  
`ELASTICSEARCH_LOG` (optional)  

`ELASTICSEARCH_HOST` (required) The elasticsearch host name, example `http://localhost:9200`.  
`ELASTICSEARCH_PORT` (required) The elasticsearch port, example `22`.  
`ELASTICSEARCH_USER` (optional) The elasticsearch user.  
`ELASTICSEARCH_PASSWORD` (optional) the elastisearch password.  

### How to run

 - Install and run [ElasticSearch](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/setup.html) or add [Bonsai service](https://addons.heroku.com/bonsai#starter) via Heroku
 - `git clone https://github.com/rafaelluisdacostacoelho/elasticfirestore`
 - `npm install`
 - Edit src/paths.ts
 - `npm run start` to run the app

## Client Implementations

Read `example/index.html` and `example/example.js` for a client implementation. It works like this:

 - Push an object to `requests` which has the following keys: `index`, `type`, and `q` (or `body` for advanced queries)
 - Listen on `responses` for the reply from the server

The `body` object can be any valid ElasticSearch DSL structure (see [Building ElasticSearch Queries](https://github.com/firebase/flashlight#building-elasticsearch-queries)).

## Deploy to Heroku

This work is in progress...

### Setup Initial Index with Bonsai

After you've deployed to Heroku, you need to create your initial index name to prevent IndexMissingException error from Bonsai. Create an index called "firebase" via curl using the BONSAI_URL that you copied during Heroku deployment.

 - `curl -X POST <BONSAI_URL>/firebase` (ex: https://user:pass@yourbonsai.bonsai.io/firebase)
 
## Building ElasticSearch Queries
------------------------------
 
 The full ElasticSearch API is supported. Check out [this great tutorial](http://okfnlabs.org/blog/2013/07/01/elasticsearch-query-tutorial.html) on querying ElasticSearch. And be sure to read the [ElasticSearch API Reference](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/).
 
### Example: Simple text search

```
 {
   "q": "foo*"
 }
```
 
### Example: Paginate
 
You can control the number of matches (defaults to 10) and initial offset for paginating search results:

```
 {
   "from" : 0, 
   "size" : 50, 
   "body": {
     "query": {
        "match": {
           "_all": "foo"
        }
     }
   }
 }; 
```
 
#### Example: Search for multiple tags or categories
 
```
 {
   "body": {
     "query": {
       { "tag": [ "foo", "bar" ] }
     }
   }
 }
```
 
[read more](https://www.elastic.co/guide/en/elasticsearch/guide/current/complex-core-fields.html)

### Example: Search only specific fields
```
 {
   "body": {
     "query": {
       "match": {
         "field":  "foo",
       }
     }
   }
 }
```
 
### Example: Give more weight to specific fields
```
 {
   "body": {
     "query": {
       "multi_match": {
         "query":  "foo",
         "type":   "most_fields", 
         "fields": [ 
            "important_field^10", // adding ^10 makes this field relatively more important 
            "trivial_field" 
         ]
       }
     }
   }
 }
```

[read more](https://www.elastic.co/guide/en/elasticsearch/guide/current/most-fields.html)

#### Helpful section of ES docs
 
 [Search lite (simple text searches with `q`)](https://www.elastic.co/guide/en/elasticsearch/guide/current/search-lite.html)  
 [Finding exact values](https://www.elastic.co/guide/en/elasticsearch/guide/current/_finding_exact_values.html)  
 [Sorting and relevance](https://www.elastic.co/guide/en/elasticsearch/guide/current/sorting.html)  
 [Partial matching](https://www.elastic.co/guide/en/elasticsearch/guide/current/partial-matching.html)  
 [Wildcards and regexp](https://www.elastic.co/guide/en/elasticsearch/guide/current/_wildcard_and_regexp_queries.html)  
 [Proximity matching](https://www.elastic.co/guide/en/elasticsearch/guide/current/proximity-matching.html)  
 [Dealing with human language](https://www.elastic.co/guide/en/elasticsearch/guide/current/languages.html)  

## Operating at massive scale

ElasticFirestore was designed to work at millions requests per second? Hmm, in a near future.
It is being developed to be used in your production services.  
Some assembly required.  

Here are a couple quick optimizations you can make to improve scale:

 * Separate the indexing worker and the query worker (this could be as simple as creating two ElastiFirestore workers, opening `monitor.ts` in each, and commenting out SearchQueue or PathMonitor respectively.
 * When your service restarts, all data is re-indexed. To prevent this, you can use refBuilder as described in the next section.
 * With a bit of work, both PathMonitor and SearchQueue could be adapted to function as a Service Worker for [firebase-queue](https://github.com/firebase/firebase-queue), allowing multiple workers and potentially hundreds of thousands of writes per second (with minor degredation and no losses at even higher throughput).

## Use refBuilder to improve indexing efficiency

In the `monitor.ts`, each entry in `paths` can be assigned a `refBuilder` function. This can construct a query for determining which records get indexed.

## Support

Submit questions or bugs using the [Issue Tracker](https://github.com/rafaelluisdacostacoelho/elasticfirestore/issues).

## License

MIT LICENSE

Copyright © 2018 [Rafael Luis da Costa Coelho](https://www.rafaelluisdacostacoelho.info)
