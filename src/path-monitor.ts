import * as admin from 'firebase-admin';

import { ElasticSearchProvider } from './providers/elasticsearch';
import { FirebaseProvider } from './providers/firebase';
import { Path } from './path';
import { blue } from 'colors/safe';

export class PathMonitor {
    private _collection: FirebaseFirestore.CollectionReference;

    constructor(
        private _elasticsearch: ElasticSearchProvider,
        private _firebase: FirebaseProvider,
        private _path: Path
    ) {
        const self = this;

        this._collection = this._firebase.firestore.collection(this._path.path);

        console.log(
            blue('Indexing %s/%s from DB "%s"'),
            this._path.index,
            this._path.type,
            this._path.path
        );

        this._path.filter = this._path.filter || function () {
            return true;
        };

        this._path.parser = this._path.parser || function (data: any) {
            return self.parseKeys(data, self._path.fields, self._path.omit);
        };

        this._initialize();
    }

    _initialize() {
        const self = this;

        this._collection.onSnapshot(
            (snapshots: FirebaseFirestore.QuerySnapshot) => {
                snapshots.docChanges().forEach(
                    (snapshot: FirebaseFirestore.DocumentChange) => {
                        if (snapshot.type === 'added') {
                            self._process(self._added, snapshot);
                        }

                        if (snapshot.type === 'modified') {
                            self._process(self._updated, snapshot);
                        }

                        if (snapshot.type === 'removed') {
                            self._process(self._removed, snapshot);
                        }
                    }
                );
            }
        );
    }

    _process(callback: Function, snapshot: FirebaseFirestore.DocumentChange) {
        const data = snapshot.doc.data();

        if (this._path.filter && this._path.filter(data) && this._path.parser) {
            callback.call(this, snapshot.doc.id, this._path.parser(data));
        }
    }

    _added(id: string, body: any) {
        const self = this;
        const name = this.nameFor(this._path, id);

        self._index(
            id,
            body,
            function (error: any) {
                if (error) {
                    console.error('failed to index %s: %s', name, error);
                } else {
                    console.log('indexed', name);
                }
            }.bind(self)
        );
    }

    _updated(id: string, body: any) {
        const self = this;
        const name = this.nameFor(this._path, id);

        self._index(
            id,
            body,
            function (error: any) {
                if (error) {
                    console.error('failed to update %s: %s', name, error);
                } else {
                    console.log('updated', name);
                }
            }.bind(self)
        );
    }

    _index(id: string, body: any, callback: Function) {
        const index = {
            index: this._path.index,
            type: this._path.type,
            id: id,
            body: body
        };

        this._elasticsearch.client.index(
            index,
            function (error: any, response: any) {
                if (callback) {
                    callback(error, response);
                }
            }.bind(this)
        );
    }

    _removed(id: string) {
        var name = this.nameFor(this._path, id);

        this._elasticsearch.client.delete(
            { index: this._path.index, type: this._path.type, id: id },
            function (error: any) {
                if (error) {
                    console.error('failed to delete %s: %s', name, error);
                } else {
                    console.log('deleted', name);
                }
            }.bind(this)
        );
    }

    _open(): Promise<any> {
        return this._elasticsearch.client.indices.open({
            index: this._path.index
        });
    }

    _close(): Promise<any> {
        return this._elasticsearch.client.indices.close({
            index: this._path.index
        });
    }

    nameFor(path: Path, key: string) {
        return path.index + '/' + path.type + '/' + key;
    }

    parseKeys(data: any, fields?: string[] | null, omit?: string[] | null) {
        if (!data || typeof data !== 'object') {
            return data;
        }
        var out = data;

        Object.keys(data).forEach((field: any) => {
            if (data[field] instanceof admin.firestore.Timestamp) {
                data[field] = data[field].toDate();
            }
        });

        if (Array.isArray(fields) && fields.length) {
            out = {};
            fields.forEach(field => {
                if (data.hasOwnProperty(field)) {
                    out[field] = data[field];
                }
            });
        }

        if (Array.isArray(omit) && omit.length) {
            omit.forEach(field => {
                if (out.hasOwnProperty(field)) {
                    delete out[field];
                }
            });
        }

        return out;
    }
}
