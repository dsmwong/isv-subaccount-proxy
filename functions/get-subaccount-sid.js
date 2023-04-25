const twilio_version = require('twilio/package.json').version;

exports.handler = async function(context, event, callback) {

  console.log(`Entered ${context.PATH} node version ${process.version} twilio version ${twilio_version}`);

  const client = context.getTwilioClient();

  try {
    // Lookup Sync Map to see if the Alpha Sender ID Record exists. If it does, return it. 
    const alphaSenderItem = await client.sync.v1.services(context.SYNC_SERVICE).syncMaps('SubaccountsMap').syncMapItems(event.AlphaSender).fetch();
    console.log('found ', alphaSenderItem);
    return callback(null, alphaSenderItem);
  } catch (e) {

    // If the record does not exist
    if( e.code === 20404) {

      // Create the Sync Map Record
      const resp = await client.api.v2010.accounts.create({friendlyName: 'Serverless Subaccount for ' + event.AlphaSender});
      
      // Store the information against the Subaccount in SyncMap
      const alphaSenderItem = await client.sync.v1.services(context.SYNC_SERVICE).syncMaps('SubaccountsMap').syncMapItems.create(
        {key: event.AlphaSender, data: {
          sid: resp.sid,
          token: resp.authToken,
          friendlyName: resp.friendlyName
        }}
      )
      console.log('created ', alphaSenderItem);
      return callback(null, alphaSenderItem);
    }
    // something else went wrong
    console.log(e);
    return callback(null, e);
  }
  
};