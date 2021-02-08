const core = require('@actions/core')
const newman = require('newman')

init()

async function init () {
  try {
    const get = core.getInput
    const required = { required: true }
    const apiBase = 'https://api.postman.com'
    const idRegex = /^[0-9]{7,}-\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/

    const options = {
      collection: get('collection', required),
      environment: get('environment'),
      globals: get('globals'),
      envVar: safeParse(get('envVar')),
      iterationCount: Number(get('iterationCount')),
      iterationData: get('iterationData'),
      folder: split(get('folder')),
      workingDir: get('workingDir'),
      insecureFileRead: safeParse(get('insecureFileRead')),
      timeout: Number(get('timeout')),
      timeoutRequest: Number(get('timeoutRequest')),
      timeoutScript: Number(get('timeoutScript')),
      delayRequest: Number(get('delayRequest')),
      ignoreRedirects: safeParse(get('ignoreRedirects')),
      insecure: safeParse(get('insecure')),
      bail: safeParse(get('bail')),
      suppressExitCode: safeParse(get('suppressExitCode')),
      reporters: split(get('reporters')),
      reporter: safeParse(get('reporter')),
      color: get('color'),
    }

    if (!options.apiKey) {
      core.warning('No Postman API key provided.')
    }

    runNewman(options)
  } catch (error) {
    core.setFailed(error.message)
  }
}

function safeParse (obj) {
  if (obj) {
    try {
      return JSON.parse(obj)
    } catch (e) {
      core.warning('Bad object passed in config!')
    }
  }

  return null
}

function split (str) {
  return str.split(',')
}

function runNewman (options) {
  newman.run(options).on('done', (err, summary) => {
    if (err || summary.error) {
      console.error('collection run encountered an error.');
    }
    else {
      console.log('collection run completed.');
    }
  })
}
