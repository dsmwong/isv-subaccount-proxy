const twilio_version = require('twilio/package.json').version;

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const client = context.getTwilioClient();

  const resp = await client.api.v2010.accounts.create({friendlyName: 'Serverless Subaccount for ' + event.AlphaSender});
  
  callback(null, resp);
};