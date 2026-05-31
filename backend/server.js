const { AppKit } = require("@circle-fin/app-kit");
const {
  createEthersAdapterFromPrivateKey
} = require("@circle-fin/adapter-ethers-v6");

const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();

const SUPPORTED_CHAINS = {
  "arc-testnet": "Arc_Testnet",
  "arc-mainnet": "Arc_Mainnet",
  "base-sepolia": "Base_Sepolia",
  "base-mainnet": "Base"
};

// Strong Preflight Handler
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle Preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC);
const systemWallet = new ethers.Wallet(process.env.SYSTEM_PRIVATE_KEY, provider);

console.log("✅ System wallet loaded:", systemWallet.address);

const kit = new AppKit();

const adapter = createEthersAdapterFromPrivateKey({
  privateKey: process.env.SYSTEM_PRIVATE_KEY
});

// Claim endpoint with logging
app.post('/api/claim', async (req, res) => {
  console.log(`[CLAIM] Request received from ${req.headers.origin}`);
  console.log(`[CLAIM] Body:`, req.body);

  const { userAddress, amount } = req.body;

  console.log("System Wallet:", systemWallet.address);
  console.log("User Address:", userAddress);
  console.log("Amount:", amount);

  if (!userAddress || !amount) {
    return res.status(400).json({ success: false, message: "❌ Missing data." });
  }

  // ... rest of your claim logic (same as before)
  try {
    const betAmount = ethers.parseUnits(amount.toString(), 6); //18
    const fullPayout = betAmount * 180n / 100n;

    const systemBalance = await provider.getBalance(systemWallet.address);
    let payoutAmount = fullPayout;
    let message = `✅ Payment complete.\n\nYou have received your ● USDC winning bet, minus 10% fee.`;

    if (systemBalance < fullPayout) {
      payoutAmount = betAmount;
      message = `❌ System balance low.\n\nYour ● USDC is returned to your wallet.`;
    }

    //const tx = await systemWallet.sendTransaction({
      //to: userAddress,
      //value: payoutAmount
    //});

    //await tx.wait();

const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

const usdc = new ethers.Contract(
  "0x3600000000000000000000000000000000000000",
  USDC_ABI,
  provider
);

const balance = await usdc.balanceOf(systemWallet.address);

console.log("System Wallet:", systemWallet.address);
console.log("USDC Balance:", ethers.formatUnits(balance, 6));
console.log("Trying to send:", ethers.formatUnits(payoutAmount, 6));

console.log("Bet Amount:", betAmount.toString());
console.log("Full Payout:", fullPayout.toString());
console.log("Payout Amount:", payoutAmount.toString());

const chain = req.body.chain || "arc-testnet";

const result = await kit.send({
  from: {
    adapter,
    chain: SUPPORTED_CHAINS[chain]
  },
  to: userAddress,
  amount: ethers.formatUnits(payoutAmount, 6),
  token: "USDC"
});

    res.json({
      success: true,
      message: message,
      //txHash: tx.hash,
      txHash: result.txHash,
      amountSent: ethers.formatUnits(payoutAmount, 6), //18
      explorerUrl: result.explorerUrl
    });

  } catch (error) {
    console.error("[CLAIM ERROR]", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// === NEW: Get System Balance Endpoint ===
app.get('/api/system-balance', async (req, res) => {
  try {
    const balance = await provider.getBalance(systemWallet.address);
    res.json({
      balance: ethers.formatUnits(balance, 6) //18
    });
  } catch (e) {
    console.error(e);
    res.json({ balance: "0" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});