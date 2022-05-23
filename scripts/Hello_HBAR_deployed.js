const { FileCreateTransaction } = require("@hashgraph/sdk");
let helloHBAR = require("../artifacts/contracts/Hello_HBAR.sol/HelloHBAR.json");
const bytecode = helloHBAR.data.bytecode.object;

const fileCreateTx = new FileCreateTransaction()
    .setContents(bytecode);

const submitTx = await fileCreateTx.execute(client);

const fileReceipt = await  submitTx.getReceipt(client);

const bytecodeFileId = fileReceipt.fileId;

console.log("The smart contract byte file ID is: " + bytecodeFileId);