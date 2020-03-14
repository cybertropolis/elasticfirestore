import { FirebaseProvider } from './providers/firebase/firebase-provider';
import { ElasticSearchProvider } from './providers/elasticsearch';
import { isObject, isString } from './utilities/validations';
import { green } from 'colors/safe';

export class SearchQueue {
    private _resquests: FirebaseFirestore.CollectionReference;

    constructor(
        private _firebase: FirebaseProvider,
        private _elasticsearch: ElasticSearchProvider,
        private _requestsPath: string,
        private _responsesPath: string,
        private _cleanupInterval: number
    ) {
        const self = this;

        this._resquests = this._firebase.firestore.collection(
            this._requestsPath
        );

        console.log(
            green('Queue started, IN: "%s", OUT: "%s"'),
            this._firebase.requestPath,
            this._firebase.responsePath
        );

        this._resquests.onSnapshot(
            (snapshots: FirebaseFirestore.QuerySnapshot) =>
                snapshots.docChanges().forEach(
                    (change: FirebaseFirestore.DocumentChange) => {
                        if (change.type === 'added') {
                            self._process(change);
                        }
                    }
                )
        );

        this._nextInterval();
    }

    _process(change: FirebaseFirestore.DocumentChange) {
        const self = this;

        const id = change.doc.id;
        const data = change.doc.data();

        console.log(green('Processing query request'), id);

        const query = this._buildQuery(id, data);

        if (query === null) {
            return;
        }

        console.log('Built query', query);

        this._elasticsearch.client.search(
            query,
            function(error: any, response: any) {
                if (error) {
                    self._replyError(id, error);
                } else {
                    self._reply(id, response);
                }
            }.bind(this)
        );
    }

    _reply(id: string, response: any) {
        if (response.error) {
            this._replyError(id, response.error);
        } else {
            console.log('query result %s: %d hits', id, response.hits.total);
            this._send(id, response);
        }
    }

    _replyError(id: any, error: any) {
        this._send(id, {
            total: 0,
            error: this._unwrapError(error),
            timestamp: Date.now()
        });
    }

    _send(id: string, response: any) {
        this._firebase.firestore
            .collection(this._requestsPath)
            .doc(id)
            .delete()
            .catch(this._logErrors.bind(this, 'Unable to remove queue item!'));

        this._firebase.firestore
            .collection(this._responsesPath)
            .doc(id)
            .set(response)
            .catch(this._logErrors.bind(this, 'Unable to send reply!'));
    }

    _logErrors(message: any, error: any) {
        if (error) {
            console.error(message.red);
            console.error(error.red);
        }
    }

    _housekeeping() {
        var self = this;

        this._resquests
            .orderBy('timestamp')
            .endAt(new Date().valueOf() - self._cleanupInterval)
            .onSnapshot((snapshots: FirebaseFirestore.QuerySnapshot) => {
                const count = snapshots.size;
                if (count) {
                    console.warn(
                        'Housekeeping: found %d outbound orphans (removing them now) %s',
                        count,
                        new Date()
                    );
                    snapshots.forEach(snapshot => {
                        snapshot.ref.delete();
                    });
                }
                self._nextInterval();
            });
    }

    _nextInterval() {
        var interval = this._cleanupInterval > 60000 ? 'minutes' : 'seconds';
        console.log(
            'Next cleanup in %d %s',
            Math.round(
                this._cleanupInterval / (interval === 'seconds' ? 1000 : 60000)
            ),
            interval
        );
        setTimeout(this._housekeeping.bind(this), this._cleanupInterval);
    }

    _buildQuery(id: string, queryData: any) {
        if (!this._assertValidSearch(id, queryData)) {
            return null;
        }

        // legacy support: q and body were merged on the client as `query`
        // in previous versions; this makes sure they still work
        if (isString(queryData.query)) {
            queryData.q = queryData.query;
        } else if (isObject(queryData.query)) {
            queryData.body = queryData.query;
        }

        if (isString(queryData.body)) {
            queryData.body = this._getJSON(queryData.body);
            if (queryData.body === null) {
                this._replyError(
                    id,
                    'Search body was a string but did not contain a valid JSON object. It must be an object or a JSON parsable string.'
                );
                return null;
            }
        }

        var query: { [field: string]: any } = {};

        Object.keys(queryData)
            .filter(function(key) {
                return key !== 'query';
            })
            .forEach(function(key) {
                query[key] = queryData[key];
            });

        return query;
    }

    _assertValidSearch(id: string, entity: any) {
        if (
            !isObject(entity) ||
            !isString(entity.index) ||
            !isString(entity.type)
        ) {
            this._replyError(
                id,
                'Search request must be a valid object with keys index, type, and one of q or body.'
            );
            return false;
        }

        if (
            !isString(entity.query) &&
            isObject(entity.query) &&
            !isString(entity.q) &&
            !isObject(entity.body) &&
            !isString(entity.body)
        ) {
            this._replyError(
                id,
                'Search must contain one of (string)q or (object)body. (Legacy `query` is deprecated but still works)'
            );
            return false;
        }

        return true;
    }

    _getJSON(value: string): any {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.log('Error parsing JSON body', e);
            return null;
        }
    }

    _unwrapError(error: any) {
        if (error && typeof error === 'object') {
            return error.toString();
        }
        return error;
    }
}
