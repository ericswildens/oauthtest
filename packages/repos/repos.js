// jshint esversion: 9

/**
 * @description null
 * @param {ParamsType} params list of command parameters
 * @param {?string} commandText text message
 * @param {!object} [secrets = {}] list of secrets
 * @param {!object} [token = null] command oauth token
 * @return {Promise<SlackBodyType>} Response body
 */
// eslint-disable-next-line no-unused-vars
async function _command(params, commandText, secrets = {}, token = null) {
  const {
    org
  } = params;

  
  const axios = require('axios');
  let msg;
  try {
    const response = await axios.get('https://api.github.com/orgs/' + org + '/repos',
     { headers: { Authorization: `Bearer ${token}`, 'accept': 'application/vnd.github.v3+json' } }
    );
    for (let i in response.data) {
      msg += response.data[i].name + "\n";
    }
  } catch (err) {
    msg = 'ERROR: ' + JSON.stringify(err);
  }
  return {
      response_type: 'in_channel', // or `ephemeral` for private response
      text: '```' + msg + '```'
    };
}

/**
 * @typedef {object} SlackBodyType
 * @property {string} text
 * @property {'in_channel'|'ephemeral'} [response_type]
 */

const main = async (args) => ({
  body: await _command(args.params, args.commandText, args.__secrets || {}, args._token || null).catch(error => ({
    // To get more info, run `/nc activation_log` after your command executes
    response_type: 'ephemeral',
    text: `Error: ${error.message}`
  }))
});
module.exports = main;

