const fs = require('fs');
const { set } = require('lodash')
const STRINGS = './strings';
const TRANSLATES = './translates';

const BLACK_LIST = [
    // "auth0-prompt-text1",
    // "auth0-prompt-text2",
    // "auth0-prompt-text3",
    // "auth0-prompt-text4",
    // "auth0-prompt-text5",
    // "authenticated-static-page-text-1",
    // "authenticated-static-page-text-2",
    // "authenticated-static-page-text-3",
    // "signup.description",
    // "login.description",
    // "reset-password-request.backToLoginLinkText",
]

const replaceStr = (obj1, obj2) => Object.entries(obj1).reduce((acc, [key, value]) => {
    if (BLACK_LIST.includes(key)) return acc;
    set(acc, key, value);
    return acc;
}, obj2);

const mapData = (strings = {}, file) => {
    fs.access(`${TRANSLATES}/${file}`, (e) => {
        if (e) console.error(`[ERROR access]: ${TRANSLATES}/${file} ==> ${e}`);
        // change file name here, if trunslation file have wrong template name xx-XX.json
        fs.readFile( `${TRANSLATES}/${file}`, 'utf8', (err, translates) => {
            if (err) console.error(`[ERROR readFile]: ${TRANSLATES}/${file} ==> ${err}`);

            let newJSON = '';

            // try/catch, if JSON in trunslations is invalid
            try {
                const translated = replaceStr(JSON.parse(translates), JSON.parse(strings));
                newJSON = JSON.stringify(translated, null, 2);
            } catch (e) {
                console.error(`[ERROR JSON operation]: ${TRANSLATES}/${file} ==> ${e}`);
            }

            fs.writeFile(`./new_strings/${file}`, newJSON, (e) => {
                if (e) {
                    console.error(`[ERROR writeFile]: ${TRANSLATES}/${file} ==> ${e}`);
                }
            });
        })
    })
}

const getFiles = () => {
    fs.readdir(STRINGS, (err, files) => {
        files.map((file) => {
            fs.readFile( `${STRINGS}/${file.toLocaleLowerCase()}`, 'utf8', (err, data) => {
                if (file.match(/.+\.json/)) mapData(data, file)
            })
        })
    })
}

getFiles();
