const { Client } = require('@xhayper/discord-rpc');

const path = require('path');

const _zTOML = require('./libs/TOMLParser');
const toml = new _zTOML(path.join(__dirname, '..', 'CONFIG.toml'));

await toml.parse(true);

const rpc = new Client().login({
    clientId: toml.d.rpc.client_id
});