/* eslint-disable no-console */

const path = require('path');
const {glob,} = require('multi-glob');
const fs = require('fs');

const langPaths = {
    'en-GB': path.resolve(__dirname, '../language/en-GB/strings.json'),
    'nl-NL': path.resolve(__dirname, '../language/nl-NL/strings.json'),
};
const strings_enGB = require('../language/en-GB/strings.json');
const strings_nlNL = require('../language/nl-NL/strings.json');

const baseStrings = {};
const existingStrings = {'en-GB': strings_enGB, 'nl-NL': strings_nlNL,};
const languages = ['en-GB', 'nl-NL',];

const regExVue = /(?:{{\s?'(.*)'\s?\|\s?trans\s?}})|(?:\$trans\('(.*?)'\))/g;

class LanguageStrings {
    constructor(existing = {}) {
        this.existing = existing;
        this.strings = {};
        this.diffStrings = [];
    }

    add(key, str) {
        if (this.existing[key] && this.existing[key] !== str && key !== str) {
            this.diffStrings.push({key, str, trans: this.existing[key],});
        }
        this.strings[key] = this.existing[key] === undefined ? str : this.existing[key];
        delete this.existing[key];
    }

    deprecateUnAddedStrings() {
        Object.entries(this.existing)
            .forEach(([key, string,]) => {
                return this.strings[key.startsWith('@deprecated') ? key : `@deprecated.${key}`] =  string;
            });
    }

    toString() {
        return JSON.stringify(this.strings, null, 4);
    }
}

function addBaseString(str, key = null) {
    if (!str || duckNumber(str)) {
        return;
    }
    baseStrings[(key||str)] = str;
}

function duckNumber(val) {
    return (val * 1) === parseInt(val, 10);
}

function handleVue(file, contents) {
    let m;
    do {
        m = regExVue.exec(contents);
        // console.log(m);
        if (m) {
            let str = m[1] || m[2];
            addBaseString(str);
        }
    } while (m);
}

function handleJson(file, contents) {
    const data = JSON.parse(contents);
    if (file === 'data/parameter-fields.json') {
        Object.values(data).forEach(field => {
            ['info', 'label', 'tip', 'disabled_message',].forEach(prop => addBaseString(field[prop]));
            field.options.forEach(text => addBaseString(text));
        });
        data.Watchlists.options.forEach(wl => addBaseString(`wl.${wl}`));
    }
    if (file === 'data/gameplans.json') {
        Object.keys(data).forEach(preset => addBaseString(`gp.${preset}`));
    }
}

// options is optional
glob(['src/**/*.vue', 'data/*.json',], {
    cwd: path.resolve(__dirname, '../'),
}, (er, files) => {
    if (er) {
        console.trace(er);
        return;
    }
    [1, 2, 3, 4, 5, 6,].forEach(nr => addBaseString(`pending_message_${nr}`));
    ['nr_equ', 'nr_pr', 'nr_opt', 'ratio_equ', 'ratio_pr', 'ratio_opt',].forEach(label => addBaseString(label));
    files.forEach(file => {
        let contents = fs.readFileSync(file);
        if (file.indexOf('.json') > -1) {
            handleJson(file, contents);
        } else {
            handleVue(file, contents);
        }

    });
    //build language files
    languages.forEach(language => {
        const langStrings = new LanguageStrings(existingStrings[language]);
        Object.keys(baseStrings).sort().forEach(key => {
            langStrings.add(key, baseStrings[key]);
        });
        langStrings.deprecateUnAddedStrings();
        fs.writeFileSync(langPaths[language], langStrings.toString());
        console.log(`Language ${language} json file saved.`);
    });

});
