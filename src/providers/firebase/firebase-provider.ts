import { Firestore } from './firestore';

import * as functions from 'firebase-functions';

export class FirebaseProvider {
    private _firestore: Firestore;
    private _functions: any;

    constructor(
        private _url: string,
        private _requestPath: string,
        private _responsePath: string,
        private _serviceAccount: any
    ) {
        this._firestore = new Firestore(this._url, this._serviceAccount);
        this._functions = functions;
    }

    get url(): string {
        return this._url;
    }

    get serviceAccount(): any {
        return this._serviceAccount;
    }

    get requestPath(): string {
        return this._requestPath;
    }

    get responsePath(): string {
        return this._responsePath;
    }

    get firestore(): Firestore {
        return this._firestore;
    }

    get functions(): any {
        return this._functions;
    }
}
