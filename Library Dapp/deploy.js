solc = require("solc");
fs = require('fs');
Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
const fileContent = fs.readFileSync("lib.sol").toString();
// console.log(fileContent);
var input = {
  language: "Solidity",
  sources: {
    "lib.sol": {
      content: fileContent,
    },
  },

  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));
// console.log(output);
ABI = output.contracts["lib.sol"]["Library"].abi;
bytecode = output.contracts["lib.sol"]["Library"].evm.bytecode.object;
//   console.log("abi:",ABI);
//  console.log("bytecode:",bytecode);
contract = new web3.eth.Contract(ABI);
web3.eth.getAccounts().then((accounts) => {
// console.log("Accounts:", accounts);
mainAccount = accounts[0];
  console.log('====================================');
  console.log("Default Account:", mainAccount);
  console.log('====================================');
contract
    .deploy({ data: bytecode })
    .send({
      from: mainAccount, gas: 4712388,
      gasPrice: 100000000000
    })
    .on("receipt", (receipt) => {
      console.log('====================================');
      console.log("Contract Address:", receipt.contractAddress);
      console.log('====================================');
})
  // .then((contract) => {
  //    const data = contract.methods.get_details();
  //    console.log(data);
  // });

  // try {
  //   contract.methods.set_book_detail("krushna","java",1,"fsdf","0x4833d70c8c94F18E9165782536268f7B9d82BcDD").send({from:'0x0cb32A397e7296765Bd1d693E828E6C870af8e4B',gas :"500000"})
  //   console.log("successful book added");
  // } catch (error) {
  //   console.log(error);
  // }
});