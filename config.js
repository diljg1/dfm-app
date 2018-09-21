
export const INTERNAL_API_HOST = process.env.VUE_APP_INTERNAL_API_HOST || '/dfm-api';
export const POLLING_INTERVAL = Number(process.env.VUE_APP_POLLING_INTERVAL) || 5000;
export const MESSAGESCROLL_INTERVAL = Number(process.env.VUE_APP_MESSAGESCROLL_INTERVAL) || 8000;
export const MAX_WAIT_TIME = Number(process.env.VUE_APP_MAX_WAIT_TIME) || 240;
export const DEFAULT_LOCALE = process.env.VUE_APP_DEFAULT_LOCALE || 'nl-NL';
export const STORAGEKEY_PENDING_PREVIEW = 'dfm.pending.previewrequest';
export const PENDING_MESSAGES_INTERVALS = [90, 70, 50, 30, 20, 10,];

//json does not work via import(?)
export const SCROLL_MESSAGES = {
    'nl-NL': require('./language/nl-NL/scroll-messages.json'),
    'en-GB': require('./language/en-GB/scroll-messages.json'),
};
export const PARAMETER_FIELDS = require('./data/parameter-fields.json');