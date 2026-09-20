require("dotenv").config();

const fs = require("fs");
const solc = require("solc");
const { ethers } = require("ethers");

const RPC_URL = process.env.ARC_RPC;
const PRIVATE_KEY = process.env.SYSTEM_PRIVATE_KEY;

const ARC_MAINNET_CHAIN_ID = 5042n;

async function main() {
  if (!RPC_URL) {
    throw new Error("ARC_RPC missing from .env");
  }

  if (!PRIVATE_KEY) {
    throw new Error("SYSTEM_PRIVATE_KEY missing from .env");
  }

  // Read Solidity source
  const source = fs.readFileSync(
    "./contracts/BetRecorderV3.sol",
    "utf8"
  );

  // Compile
  const input = {
    language: "Solidity",

    sources: {
      "contracts/BetRecorderV3.sol": {
        content: source
      }
    },

    settings: {
      optimizer: {
        enabled: false
      },

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

  const output = JSON.parse(
    solc.compile(
      JSON.stringify(input)
    )
  );

  // Show compiler warnings/errors
  if (output.errors) {
    for (const error of output.errors) {
      console.log(error.formattedMessage);
    }

    const fatalErrors =
      output.errors.filter(
        e => e.severity === "error"
      );

    if (fatalErrors.length > 0) {
      throw new Error(
        "Solidity compilation failed"
      );
    }
  }

  const contract =
    output.contracts[
      "contracts/BetRecorderV3.sol"
    ].BetRecorderV3;

  const abi = contract.abi;

  const bytecode =
    "0x" +
    contract.evm.bytecode.object;

  console.log(
    "Compiler:",
    solc.version()
  );

  // Connect to Arc
  const provider =
    new ethers.JsonRpcProvider(
      RPC_URL
    );

  const network =
    await provider.getNetwork();

  console.log(
    "Connected chain:",
    network.chainId.toString()
  );

  // Prevent accidental testnet deployment
  if (
    network.chainId !==
    ARC_MAINNET_CHAIN_ID
  ) {
    throw new Error(
      `Wrong network. Expected Arc Mainnet 5042, got ${network.chainId}`
    );
  }

  const wallet =
    new ethers.Wallet(
      PRIVATE_KEY,
      provider
    );

  console.log(
    "Deploying from:",
    wallet.address
  );

  // Check Arc native gas balance
  const balance =
    await provider.getBalance(
      wallet.address
    );

  console.log(
    "Gas balance:",
    ethers.formatEther(balance),
    "USDC"
  );

  if (balance === 0n) {
    throw new Error(
      "Wallet has no Arc Mainnet USDC for gas"
    );
  }

  // Create factory
  const factory =
    new ethers.ContractFactory(
      abi,
      bytecode,
      wallet
    );

  // Estimate deployment gas
  const deployTx =
    await factory.getDeployTransaction();

  const estimatedGas =
    await provider.estimateGas({
      ...deployTx,
      from: wallet.address
    });

  console.log(
    "Estimated gas:",
    estimatedGas.toString()
  );

  // Deploy
  console.log(
    "Deploying BetRecorderV3..."
  );

  const deployed =
    await factory.deploy();

  const tx =
    deployed.deploymentTransaction();

  console.log(
    "Deployment TX:",
    tx.hash
  );

  console.log(
    "Waiting for confirmation..."
  );

  await deployed.waitForDeployment();

  const address =
    await deployed.getAddress();

  console.log("");
  console.log(
    "BetRecorderV3 deployed successfully"
  );

  console.log(
    "Contract Address:",
    address
  );

  console.log(
    "Owner:",
    wallet.address
  );

  console.log(
    "Explorer:",
    `https://explorer.arc.io/address/${address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });