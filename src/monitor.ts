import { FirebaseProvider } from './providers/firebase/firebase-provider';
import { ElasticSearchProvider } from './providers/elasticsearch/elasticsearch-provider';

import { PathMonitor } from './path-monitor';

import { Environment } from './environment';
import { PATHS } from './settings/paths';
import { Path } from './path';
import { SearchQueue } from './search-queue';
import { gray, green, blue } from 'colors/safe';

export class Monitor {
    private _elasticsearch: ElasticSearchProvider;
    private _firebase: FirebaseProvider;

    constructor(private _environment: Environment) {
        this._elasticsearch = this._environment.elasticsearch;
        this._firebase = this._environment.firebase;
    }

    start() {
        const self = this;

        var timer = setInterval(() => {
            self._ping(timer);
        }, 5000);
    }

    private _ping(timer: NodeJS.Timer) {
        const self = this;

        this._elasticsearch.client
            .ping({
                requestTimeout: 5000,
                maxRetries: 6
            })
            .then(function () {
                console.log(
                    green('Connected to ElasticSearch host %s:%s'),
                    self._elasticsearch.host,
                    self._elasticsearch.port
                );
                clearInterval(timer);
                self._connect();
            });
    }

    private _connect() {
        console.log(gray('Connecting to Firebase %s'), this._firebase.url);

        this._firebase.firestore.initialize();

        this._process(PATHS);

        new SearchQueue(
            this._firebase,
            this._elasticsearch,
            this._firebase.requestPath,
            this._firebase.responsePath,
            this._environment.cleanupInterval
        );
    }

    private _process(paths: Path[]) {
        const self = this;

        for (const path of paths) {

            // TODO: Verificar se o indice já existe e reiniciar ele.
            // self._createIndex(self, path);
            this._deleteIndex(self, path).then(() => self._createIndex(self, path));
        }
    }

    private _deleteIndex(self: any, path: Path): Promise<any> {
        return self._elasticsearch.client.indices
            .delete({
                index: path.index
            });
    }

    private _createIndex(self: any, path: Path): Promise<any> {
        return self._elasticsearch.client.indices
            .create({
                index: path.index
            })
            .then(() => {
                console.log(blue(`1. creating index ${path.index}`));

                self._elasticsearch.client.indices
                    .close({
                        index: path.index
                    })
                    .then(async () => {
                        console.log(green(`2. closed`));

                        return self._elasticsearch.client.indices
                            .putSettings({
                                index: path.index,
                                body: path.settings
                            })
                            .then(() => {
                                console.log(green(`3. settings done`));
                            });
                    })
                    .then(async () => {
                        return self._elasticsearch.client.indices
                            .putMapping({
                                index: path.index,
                                type: path.type,
                                body: path.mappings
                            })
                            .then(() => {
                                console.log(green(`4. mapping done`));
                            });
                    })
                    .then(async () => {
                        return self._elasticsearch.client.indices
                            .open({
                                index: path.index
                            })
                            .then(() => {
                                console.log(green(`5. opened`));
                            });
                    })
                    .then(async () => {
                        console.log(green(`starting path monitor...`));

                        new PathMonitor(self._elasticsearch, self._firebase, path);
                    });
            });
    }
}
