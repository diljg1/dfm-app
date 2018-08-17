import strings_enGB from '../../language/en-GB/strings.json';
import strings_nlNL from '../../language/nl-NL/strings.json';

class Translator {

    constructor(locale) {
        this.strings = {};
        if (locale === 'en-GB') {
            this.strings = strings_enGB;
        } else if (locale === 'nl-NL') {
            this.strings = strings_nlNL;
        }
    }

    translate(string) {
        return this.strings[string] || string;
    }
}

const TranslateFilter = {
    install(Vue, {$locale,}) {

        const translator = new Translator($locale);

        Vue.prototype.$trans = str => translator.translate(str);

        Vue.filter('trans', str => translator.translate(str));
    },
};

export default TranslateFilter;