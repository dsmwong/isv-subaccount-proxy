require('dotenv').config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const fs = require('fs');
const path = require('path');

async function main() {
  const friendlyNamePrefix = "Script Created Subaccount "
  try {

    if( process.argv.length < 3) {
      console.log(`usage: ${path.basename(process.argv[0])} ./${path.basename(process.argv[1])} <alpha-list>`);
      process.exit(1);
    }

    // Fetch Subaccounts
    console.log(`Listing Subaccounts`)
    const subaccount_list = await client.api.v2010.accounts.list({status: "active"});
    //console.log(JSON.stringify(subaccount_list, null, 2));

    subaccount_list.forEach(element => {
      console.log(`Subaccount ${element.friendlyName} with SID ${element.sid} created on ${element.dateCreated}`);
    });

    // find Alpha Sender in file
    const csvfile = process.argv[2];
    console.log('Reading File ' + csvfile);

    const csvdata = fs.readFileSync(csvfile, "utf8");
    const csvlines = csvdata.split("\n");
    csvlines.forEach(async alpha => {
      
      const friendlyName = `${friendlyNamePrefix} (${alpha})`
      // Check if the account for the Alpha exists
      console.log('Found Alpha' + alpha);
      const subaccountMatch = subaccount_list.find(subaccount => subaccount.friendlyName === friendlyName);
      if( subaccountMatch ) {
        // If exist show the details
        console.log(`Found Subaccount Match for ${alpha} with Name '${subaccountMatch.friendlyName}' and SID ${subaccountMatch.sid}`);
      } else {
        // If not, create the subaccount
        console.log(`No Subaccount Match for ${alpha}`);
        const newSubaccount = await client.api.v2010.accounts.create({friendlyName: friendlyName})
        console.log(JSON.stringify(newSubaccount, null, 2));
      }
    });

  }
  catch(err) {
    console.error(err);
  }
}

main();