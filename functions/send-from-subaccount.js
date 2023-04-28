const twilio_version = require('twilio/package.json').version;

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const client = context.getTwilioClient({ accountSid: event.Subaccount });

  // Start Code Here
  try {
    const message = await client.messages.create({from: event.Sender, to: event.To, body: event.Body});
    console.log(message)
    callback(null, message);
  } catch (e) {
    console.log(e);
    callback(null, e);
  }
  
};