export class ElasticSearchOptions {
    constructor(
        private _requestTimeout: number,
        private _maxSockets: number,
        private _log: string
    ) {}

    get requestTimeout() {
        return this._requestTimeout;
    }

    get maxSockets() {
        return this._maxSockets;
    }

    get log() {
        return this._log;
    }
}
