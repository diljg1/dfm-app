
export const INTERNAL_API_HOST = process.env.VUE_APP_INTERNAL_API_HOST || '/dfm-api';
export const POLLING_INTERVAL = process.env.VUE_APP_POLLING_INTERVAL || 5000;

//does not work via import
export const SCROLL_MESSAGES = require('./data/scroll-messages.json');