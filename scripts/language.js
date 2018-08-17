/* eslint-disable no-console */

const path = require('path');
const {glob,} = require('multi-glob');
const fs = require('fs');

const strings_enGB = require('../language/en-GB/strings.json');
const strings_nlNL = require('../language/nl-NL/strings.json');

const existing = {'en-GB': strings_enGB, 'nl-NL': strings_nlNL,};
const strings = {'en-GB': {}, 'nl-NL': {},};

const regExVue = /(?:\{\{\s?'(.*)'\s?\|\s?trans\s?\}\})|(?:\$trans\('(.*)'\))/g;

function addString(str) {
    if (!str || duckNumber(str)) {
        return;
    }
    Object.keys(strings).forEach(locale => strings[locale][str] = existing[locale][str] || str);
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
            addString(str);
        }
    } while (m);
}

function handleJson(file, contents) {
    const data = JSON.parse(contents);
    if (file === 'data/parameter-fields.json') {
        Object.values(data).forEach(field => {
            ['info', 'label', 'tip',].forEach(prop => addString(field[prop]));
            Object.values(field.options).forEach(text => addString(text));
        });
    } else if (file === 'data/scroll-messages.json') {
        //todo
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
    files.forEach(file => {
        let contents = fs.readFileSync(file);
        if (file.indexOf('.json') > -1) {
            handleJson(file, contents);
        } else {
            handleVue(file, contents);
        }

    });
    Object.keys(strings).forEach(locale => {
        fs.writeFileSync(path.resolve(__dirname, `../language/${locale}/strings.json`), JSON.stringify(strings[locale], null, 4));
    });
    console.log(strings);

});