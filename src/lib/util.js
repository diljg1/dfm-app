import {find, on,} from 'uikit/src/js/util';
const {ajax,} = UIkit.util;
import {JOOMLA_AJAX_URL,} from '@/../config';
import * as types from '@/store/mutation-types';
const token = window.$token;

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

function getApiErrorInfo(err) {
    let error;
    let status = err.status || 500;
    if (err.xhr && err.xhr.response) {
        error = err.xhr.response.message || err.xhr.response;
    } else {
        error = err.message || err;
    }
    return {error, status,};
}

export function apiRequest(ajaxMethod, data = null) {
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
    };
    return new Promise((resolve, reject) => {
        ajax(`${JOOMLA_AJAX_URL}&method=${ajaxMethod}`, {
            method: 'post',
            responseType: 'json',
            headers,
            data: data ? JSON.stringify(data) : null,
        })
            .then(({response, status,}) => {
                if (status === 204) {
                    resolve(null);
                }
                if (typeof response === 'string') {
                    response = JSON.parse(response); //IE does not parse the response
                }
                const {success, message, data,} = response;
                if (!success) {
                    reject({error: message, status,});
                }
                resolve(data);
            })
            .catch(err => reject(getApiErrorInfo(err)));
    });
}

export function focusInput(context) {
    const focusEl = find('[autofocus=autofocus]', context);
    if (focusEl) {
        focusEl.focus();
    }
}

export function onOwnEvent(el, event, cb) {
    on(el, event, e => {
        if(e.target === el) {
            cb(e);
        }
    });
}
