const { Client } = require("@hashgraph/sdk");

require("dotevn").config();

async function main() {

    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);
}
main();
