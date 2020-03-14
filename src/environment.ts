import {
    ElasticSearchProvider,
    ElasticSearchOptions
} from './providers/elasticsearch';
import { FirebaseProvider } from './providers/firebase';
import { BonsaiProvider } from './providers/bonsai';

import { Path } from './path';

import { PATHS } from './settings/paths';

export class Environment {
    private _paths: Array<Path>;
    private _cleanupInterval: number;

    private _elasticsearch: ElasticSearchProvider;
    private _firebase: FirebaseProvider;
    private _bonsai?: BonsaiProvider;

    public constructor() {
        const self = process.env;

        this._paths = PATHS;
        this._cleanupInterval = Number(process.env.CLEANUP_INTERVAL);

        this._firebase = this.newFirebaseProvider(
            String(self.FIREBASE_URL),
            String(self.FIREBASE_REQUEST),
            String(self.FIREBASE_RESPONSE),
            self.FIREBASE_SERVICE_ACCOUNT
        );

        this.newBonsaiProvider(String(self.BONSAI_URL));

        const elasticSearchOptions = this.newElasticSearchOptions(
            Number(self.ELASTICSEARCH_REQUEST_TIMEOUT),
            Number(self.ELASTICSEARCH_MAX_SOCKETS),
            String(self.ELASTICSEARCH_LOG)
        );

        this._elasticsearch = this.newElasticsearchProvider(
            String(self.ELASTICSEARCH_HOST),
            Number(self.ELASTICSEARCH_PORT),
            String(self.ELASTICSEARCH_USER),
            String(self.ELASTICSEARCH_PASSWORD),
            elasticSearchOptions
        );
    }

    get paths() {
        return this._paths;
    }

    get cleanupInterval() {
        return this._cleanupInterval;
    }

    get bonsai() {
        return this._bonsai;
    }

    get elasticsearch(): ElasticSearchProvider {
        return this._elasticsearch;
    }

    get firebase(): FirebaseProvider {
        return this._firebase;
    }

    private newFirebaseProvider(
        url: string,
        requestPath: string,
        responsePath: string,
        serviceAccount: any
    ) {
        return new FirebaseProvider(
            url,
            requestPath,
            responsePath,
            serviceAccount
        );
    }

    private newBonsaiProvider(url: string) {
        if (url) {
            this._bonsai = new BonsaiProvider(url);
        } else {
            console.log(
                'There are no environment variables for ElasticSearchProvider.'
            );
        }
    }

    private newElasticsearchProvider(
        host: string,
        port: number,
        user: string,
        password: string,
        options: ElasticSearchOptions
    ): ElasticSearchProvider {
        return new ElasticSearchProvider(host, port, user, password, options);
    }

    private newElasticSearchOptions(
        requestTimeout: number,
        maxSockets: number,
        log: string
    ): ElasticSearchOptions {
        return new ElasticSearchOptions(requestTimeout, maxSockets, log);
    }
}
