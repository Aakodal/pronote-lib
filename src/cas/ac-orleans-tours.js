const jsdom = require('jsdom');
const util = require('../util');

async function login({ username, password, url })
{

    let jar = new jsdom.CookieJar();
    let dom = await util.getDOM({
        url: `https://lycees.netocentre.fr/portail/f/welcome/normal/render.uP`,
        jar
    });

    dom = await util.getDOM({
        url: dom.window.document.getElementById('portalCASLoginLink').href + '&idpId=parentEleveEN-IdP',
        jar
    });

    dom.window.document.getElementById('username').value = username;
    dom.window.document.getElementById('password').value = password;

    dom = await util.submitForm({
        dom,
        jar,
        actionRoot: 'https://educonnect.education.gouv.fr/',
        extraParams: {
            '_eventId_proceed': ''
        }
    });

    if (!dom.window.document.querySelector('input[name=SAMLResponse]')) {
        throw 'bad login';
    }

    await util.submitForm({
        dom,
        jar
    });

    return util.extractStart(await util.getDOM({
        url,
        jar,
        asIs: true
    }));
}

module.exports = login;
