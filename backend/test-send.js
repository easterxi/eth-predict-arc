require("dotenv").config();

const { AppKit } = require("@circle-fin/app-kit");
const {
  createEthersAdapterFromPrivateKey
} = require("@circle-fin/adapter-ethers-v6");

const kit = new AppKit();

const adapter = createEthersAdapterFromPrivateKey({
  privateKey: process.env.SYSTEM_PRIVATE_KEY
});

async function test() {
  const result = await kit.send({
    from: {
      adapter,
      chain: "Arc_Testnet"
    },
    to: "0x9068d4a1edcea0e553525e8ca5edbe57dfe900b6",
    amount: "1.00",
    token: "USDC"
  });

  console.log(result);
}

test();