const PocketBase = require('pocketbase/cjs')
require('cross-fetch/polyfill');

export const pb_client = new PocketBase(process.env.pb_url)