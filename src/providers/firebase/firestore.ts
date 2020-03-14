import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { green } from 'colors/safe';

export class Firestore {
    constructor(private _url: string, private _serviceAccount: any) {}

    initialize() {
        const configuration: admin.AppOptions = {
            credential: admin.credential.cert(this._serviceAccount),
            databaseAuthVariableOverride: undefined, // TODO: tornar configurável
            databaseURL: this._url,
            serviceAccountId: undefined, // TODO: tornar configurável
            storageBucket: 'rapid-rabbit-market.appspot.com', // TODO: tornar configurável
            projectId: 'rapid-rabbit-market' // TODO: tornar configurável
        };

        admin.initializeApp(configuration);
        admin.firestore().settings({ timestampsInSnapshots: true });

        console.log(green('Connected to Firebase host %s'), this._url);
    }

    document(path: string) {
        return functions.firestore.document(path);
    }

    collection(path: string): FirebaseFirestore.CollectionReference {
        return admin.firestore().collection(path);
    }

    doc(path: string, id: string): FirebaseFirestore.DocumentReference {
        return admin
            .firestore()
            .collection(path)
            .doc(id);
    }
}
