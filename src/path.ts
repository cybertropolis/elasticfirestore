/** Paths to Monitor
 *
 * Each path can have these keys:
 * {string}   path:    [required] the Firebase path to be monitored, for example, `users/profiles`
 *                     would monitor https://<instance>.firebaseio.com/users/profiles
 * {string}   index:   [required] the name of the ES index to write data into
 * {string}   type:    [required] name of the ES object type this document will be stored as
 * {Array}    fields:  list of fields to be monitored and indexed (defaults to all fields, ignored if "parser" is specified)
 * {Array}    omit:    list of fields that should not be indexed in ES (ignored if "parser" is specified)
 * {Function} filter:  if provided, only records that return true are indexed
 * {Function} parser:  if provided, the results of this function are passed to ES, rather than the raw data (fields is ignored if this is used)
 * {Function} refBuilder: see README
 *
 * To store your paths dynamically, rather than specifying them all here, you can store them in Firebase.
 * Format each path object with the same keys described above, and store the array of paths at whatever
 * location you specified in the FB_PATHS variable. Be sure to restrict that data in your Security Rules.
 */

// export class Path {
//     private _path: string;
//     private _index: string;
//     private _type: string;
//     private _fields?: Array<string> | null;
//     private _omit?: Array<string> | null;
//     private _filter?: Function | null;
//     private _parser?: Function | null;
//     private _refBuilder?: Function | null;
//     private _settings?: any | null;
//     private _mappings?: any | null;

//     constructor(path?: { [key: string]: any }) {
//         const instance = path || {};

//         this._path = instance.path;
//         this._index = instance.index;
//         this._type = instance.type;
//         this._fields = instance.fields;
//         this._omit = instance.omit;
//         this._filter = instance.filter;
//         this._parser = instance.parser;
//         this._refBuilder = instance.refBuilder;
//         this._settings = instance.settings;
//         this._mappings = instance.mappings;
//     }

//     get path() {
//         return this._path;
//     }

//     get index() {
//         return this._index;
//     }

//     get type() {
//         return this._type;
//     }

//     get fields() {
//         return this._fields;
//     }

//     get omit() {
//         return this._omit;
//     }

//     get filter(): Function | null | undefined {
//         return this._filter;
//     }

//     set filter(value: Function | null | undefined) {
//         this._filter = value;
//     }

//     get parser(): Function | null | undefined {
//         return this._parser;
//     }

//     set parser(value: Function | null | undefined) {
//         this._parser = value;
//     }

//     get refBuilder() {
//         return this._refBuilder;
//     }

//     set refBuilder(value: Function | null | undefined) {
//         this._refBuilder = value;
//     }

//     get settings(): any | null | undefined {
//         return this._settings;
//     }

//     set settings(value: any | null | undefined) {
//         this._settings = value;
//     }

//     get mappings(): any | null | undefined {
//         return this._mappings;
//     }

//     set mappings(value: any | null | undefined) {
//         this._mappings = value;
//     }
// }

export class Path {
    public path: string;
    public index: string;
    public type: string;
    public fields?: Array<string> | null;
    public omit?: Array<string> | null;
    public filter?: Function | null;
    public parser?: Function | null;
    public refBuilder?: Function | null;
    public settings?: any | null;
    public mappings?: any | null;
    public warmers?: any | null;
    public aliases?: any | null;
    constructor(path?: { [key: string]: any }) {
        const instance = path || {};

        this.path = instance.path;
        this.index = instance.index;
        this.type = instance.type;
        this.fields = instance.fields;
        this.omit = instance.omit;
        this.filter = instance.filter;
        this.parser = instance.parser;
        this.refBuilder = instance.refBuilder;
        this.settings = instance.settings;
        this.mappings = instance.mappings;
    }
}