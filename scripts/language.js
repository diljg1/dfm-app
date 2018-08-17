/* eslint-disable no-console */

const path = require('path');
const {glob,} = require('multi-glob');
const fs = require('fs');

const strings_enGB = require('../language/en-GB/strings.json');
const strings_nlNL = require('../language/nl-NL/strings.json');

const existing = {'en-GB': strings_enGB, 'nl-NL': strings_nlNL,};
const strings = {'en-GB': {}, 'nl-NL': {},};

const regExVue = /(?:\{\{\s?'(.*)'\s?\|\s?trans\s?\}\})|(?:\$trans\('(.*)'\))/g;

function handleVue(file, contents) {
    let m;
    do {
        m = regExVue.exec(contents);
        // console.log(m);
        if (m) {
            let str = m[1] || m[2];
            strings['en-GB'][str] = existing['en-GB'][str] || str;
            strings['nl-NL'][str] = existing['nl-NL'][str] || str;
        }
    } while (m);
}

function handleJson(file, contents) {
    const data = JSON.parse(contents);
    if (file === 'data/parameter-fields.json') {
        Object.entries(data).forEach(([key, field,]) => {
            ['info', 'label', 'tip',].forEach(prop => {
                let str = field[prop];
                if (str) {
                    strings['en-GB'][str] = existing['en-GB'][str] || str;
                    strings['nl-NL'][str] = existing['nl-NL'][str] || str;
                }
            });
            Object.entries(field.options).forEach(([value, text,]) => {
                let str = text;
                if (str) {
                    strings['en-GB'][str] = existing['en-GB'][str] || str;
                    strings['nl-NL'][str] = existing['nl-NL'][str] || str;
                }
            });

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
    console.log(strings);

    fs.writeFileSync(path.resolve(__dirname, '../language/en-GB/strings.json'), JSON.stringify(strings['en-GB'], null, 2));
    fs.writeFileSync(path.resolve(__dirname, '../language/nl-NL/strings.json'), JSON.stringify(strings['nl-NL'], null, 4));

});