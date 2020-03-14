import { Client } from 'elasticsearch';

import { ElasticSearchOptions } from './elasticsearch-options';
import { gray } from 'colors/safe';

export class ElasticSearchProvider {
    private _client: Client;

    constructor(
        private _host: string,
        private _port: number,
        private _user: string,
        private _password: string,
        private _options: ElasticSearchOptions
    ) {
        let configuration: any = {
            hosts: [
                {
                    host: this._host,
                    port: this._port,
                    auth:
                        this._user && this._password
                            ? `${this._user}:${this._password}`
                            : null
                }
            ]
        };

        if (
            this._options.requestTimeout &&
            this._options.maxSockets &&
            this._options.log
        ) {
            Object.assign(configuration, {
                requestTimeout: this._options.requestTimeout,
                log: this._options.log,
                maxSockets: this._options.maxSockets
            });
        }

        this._client = new Client(configuration);

        console.info(
            gray('Connecting to ElasticSearch host %s:%s'),
            this._host,
            this._port
        );
    }

    get host() {
        return this._host;
    }

    get port() {
        return this._port;
    }

    get client(): Client {
        return this._client;
    }
}
