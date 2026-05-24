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
  const { userAddress, amount } = req.body;

  if (!userAddress || !amount) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const tx = await systemWallet.sendTransaction({
      to: userAddress,
      value: ethers.parseUnits((amount * 2).toString(), 6) // 2x reward (USDC decimals = 6 on ARC)
    });

    await tx.wait();

    res.json({
      success: true,
      message: "Reward sent successfully",
      txHash: tx.hash
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