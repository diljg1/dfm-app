
export const JOOMLA_AJAX_URL = process.env.VUE_APP_JOOMLA_AJAX_URL || '/index.php';
export const POLLING_INTERVAL = Number(process.env.VUE_APP_POLLING_INTERVAL) || 5000;
export const MESSAGESCROLL_INTERVAL = Number(process.env.VUE_APP_MESSAGESCROLL_INTERVAL) || 8000;
export const MAX_WAIT_TIME = Number(process.env.VUE_APP_MAX_WAIT_TIME) || 240;
export const DEFAULT_LOCALE = process.env.VUE_APP_DEFAULT_LOCALE || 'nl-NL';
export const STORAGEKEY_PENDING_PREVIEW = 'dfm.pending.previewrequest';
export const PENDING_MESSAGES_INTERVALS = [90, 70, 50, 30, 20, 10,];
export const IMAGE_PATH = process.env.VUE_APP_IMAGE_PATH || '';

//json does not work via import(?)
export const SCROLL_MESSAGES = {
    'nl-NL': require('./language/nl-NL/scroll-messages.json'),
    'en-GB': require('./language/en-GB/scroll-messages.json'),
};
export const PARAMETER_FIELDS = require('./data/parameter-fields.json');
export const GAMEPLAN_PRESETS = require('./data/gameplans.json');
