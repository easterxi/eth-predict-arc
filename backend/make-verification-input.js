const fs = require("fs");
const solc = require("solc");

const source =
  fs.readFileSync(
    "./contracts/BetRecorderV3.sol",
    "utf8"
  );

const input = {
  language: "Solidity",

  sources: {
    "./contracts/BetRecorderV3.sol": {
      content: source
    }
  },

  settings: {
    outputSelection: {
      "*": {
        "*": [
          "abi",
          "evm.bytecode"
        ]
      }
    }
  }
};

fs.writeFileSync(
  "./standard-input.json",
  JSON.stringify(input, null, 2)
);

console.log(
  "Created standard-input.json"
);

console.log(
  "Compiler:",
  solc.version()
);