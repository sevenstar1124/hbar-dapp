require("dotenv").config();
const {
    AccountId,
    PrivateKey,
    Client,
    Hbar,
    FileCreateTransaction,
    ContractCreateTransaction,
    ContractFunctionParameters,
    ContractExecuteTransaction,
    ContractCallQuery
} = require("@hashgraph/sdk");
const fs = require("fs");

const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

async function main() {

    const contractBytecode = fs.readFileSync("Hello_HBAR_sol_HelloHBAR.bin");

    const fileCreateTx = new FileCreateTransaction()
    .setContents(contractBytecode)
    .setKeys([operatorKey])
    .setMaxTransactionFee(new Hbar(0.75))
    .freezeWith(client);
    const fileCreateSign = await fileCreateTx.sign(operatorKey);
    const fileCreateSubmit = await fileCreateSign.execute(client);
    const fileCreateRx = await fileCreateSubmit.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;
    console.log(`🚀 The bytecode file ID is: ${bytecodeFileId} \n`);

    const contractInstantiateTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(100000)
        .setConstructorParameters(new ContractFunctionParameters().addString("Rafa").addUint256(111111));
        const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
        const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
        const contractId = contractInstantiateRx.contractId;
        const contractAddress = contractId.toSolidityAddress();
        console.log(`🥳 The smart contract ID is: ${contractId} \n`);
        console.log(`👻 The smart contract ID in Solidity format is: ${contractAddress} \n`);

        const contractQueryTx = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getMobileNumber", new ContractFunctionParameters().addString("Rafa"))
        .setMaxQueryPayment(new Hbar(0.00000001))
        const contractQuerySubmit = await contractQueryTx.execute(client)
        const contractQueryResult = contractQuerySubmit.getUint256s(0);
        console.log(`Here is the number phone you asked for: ${contractQueryResult} \n`);
    }

main();

