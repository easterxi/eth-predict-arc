const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC);
const systemWallet = new ethers.Wallet(process.env.SYSTEM_PRIVATE_KEY, provider);

console.log("✅ System wallet loaded:", systemWallet.address);

// ========== PAYOUT ENDPOINT ==========
app.post('/api/claim', async (req, res) => {
  const { userAddress, amount } = req.body;   // amount = user's original bet

  if (!userAddress || !amount) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const betAmount = ethers.parseUnits(amount.toString(), 18);
    const fullPayout = betAmount * 180n / 100n;     // 1.8x (2x - 10% fee)
    const originalBet = betAmount;                  // 1x refund if insufficient

    // Check system wallet balance
    const systemBalance = await provider.getBalance(systemWallet.address);

    let payoutAmount;
    let message;

    if (systemBalance >= fullPayout) {
      payoutAmount = fullPayout;
      message = `You won 2x - 10% fee = ${ethers.formatUnits(payoutAmount, 18)} USDC`;
    } else {
      payoutAmount = originalBet;
      message = `System has insufficient funds. You receive only your original bet: ${amount} USDC (no profit)`;
    }

    const tx = await systemWallet.sendTransaction({
      to: userAddress,
      value: payoutAmount
    });

    await tx.wait();

    res.json({
      success: true,
      message: message,
      txHash: tx.hash,
      amountSent: ethers.formatUnits(payoutAmount, 18)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});