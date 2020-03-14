export function isObject(value: any): boolean {
    return value && typeof value === 'object';
}

export function isString(value: any): boolean {
    return typeof value === 'string';
}

export function unwrapError(error: any) {
    if (error && typeof error === 'object') {
        return error.toString();
    }
    return error;
}

export function isFunction(value: any): boolean {
    return typeof value === 'function';
}
