const request = require('../request');
const util = require('../util');

async function login({ username, password, url })
{

    let html = await request.http({
        url: url + 'eleve.html?login=true',
        method: 'GET'
    });

    return util.extractStart(html);
}

module.exports = login;
