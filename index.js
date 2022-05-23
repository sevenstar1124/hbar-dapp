const { Client, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction} = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {

    const myAccountId = process.env.MY_ACCOUNT_ID;
    const myPrivateKey = process.env.MY_PRIVATE_KEY;

    if (myAccountId == null ||
        myPrivateKey == null ) {
        throw new Error("Environment variables myAccountId and myPrivateKey must be present");
    }

    const client = Client.forTestnet();

    client.setOperator(myAccountId, myPrivateKey);

    const newAccountPrivateKey = await PrivateKey.generateED25519(); 
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    const newAccount = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;

    console.log("🚀 The new account ID is: " +newAccountId);

    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("💰 The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

    // Transfer transaction
    const sendHbar = await new TransferTransaction()
    .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000))
    .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))
    .execute(client);

    // Verify the trasnfer transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("🖊 The transfer transaction from my account to the new account was: ", transactionReceipt.status.toString());

    // Get the updatd account balance
    const queryCost = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .getCost(client);

    console.log("🧮 The const of query is: " + queryCost);

    const getNewBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

    console.log("The account balance after the transfer is: " + getNewBalance.hbars.toTinybars() + " tinnybar.")
}
main();