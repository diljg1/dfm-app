export function arrayWithReplacedItem(array, index, item) {
    const copy = array.slice();
    copy.splice(index, 1, item);
    return copy;
}
export function arrayWithRemovedItem(array, index) {
    const copy = array.slice();
    copy.splice(index, 1);
    return copy;
}

export function getApiErrorInfo(err) {
    let error;
    let status = err.status || 500;
    if (err.xhr && err.xhr.response) {
        error = err.xhr.response.message || err.xhr.response;
    } else {
        error = err.message || err;
    }
    return {error, status,};
}
