export class BonsaiProvider {
    private _user: string = '';
    private _password: string = '';
    private _host: string = '';
    private _port: number = 0;

    constructor(url: string) {
        const matches = url.match(/^https?:\/\/([^:]+):([^@]+)@([^/]+)\/?$/);

        if (matches) {
            this._user = matches[1];
            this._password = matches[2];
            this._host = matches[3];
            this._port = 80;

            console.log(
                'Configured using BONSAI_URL environment variable',
                url
            );
        }
    }

    get user() {
        return this._user;
    }

    get password() {
        return this._password;
    }

    get host() {
        return this._host;
    }

    get port() {
        return this._port;
    }
}
