import CONFIG from './config.js';

// Global variables
let provider, signer, userAddress;
let currentBet = { amount: 1, time: 10, direction: "HIGHER" };
let startPrice = 0;
let endPrice = 0;
let countdownInterval = null;
let currentETHPrice = 3200; // fallback

// Get real ETH price
async function getETHPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await res.json();
    return parseFloat(data.ethereum.usd) || 3200;
  } catch (e) {
    console.warn("Price API failed, using fallback");
    return 3200;
  }
}

// Update live price display
async function updateLivePrice(textboxId) {
  const price = await getETHPrice();
  currentETHPrice = price;
  const el = document.getElementById(textboxId);
  if (el) el.value = price.toFixed(2);
}

// Connect Wallet
async function connectWallet() {
  if (!window.ethereum) {
    alert("❌ No EVM wallet detected. Please install MetaMask or Rabby.");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    userAddress = accounts[0];

    const chain = CONFIG.chains[CONFIG.defaultChain];

    // Switch / Add network
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain.chainId }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chain.chainId,
            chainName: chain.name,
            rpcUrls: [chain.rpcUrl],
            nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
            blockExplorerUrls: [chain.explorer]
          }]
        });
      }
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    alert(`✅ Connected: ${userAddress.slice(0,6)}...${userAddress.slice(-4)} on ${chain.name}`);
    showScreen2();
  } catch (e) {
    console.error(e);
    alert("Connection failed. Check console.");
  }
}

// Screen 1 - Connect
function showScreen1() {
  document.getElementById('app').innerHTML = `
    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px">
      <h1 style="font-size:3.2rem">PREDICT ETH</h1>
      <button class="btn" onclick="connectWallet()" style="padding:25px 80px;font-size:1.8rem">CONNECT WALLET</button>
      <p style="text-align:center;max-width:300px">Only ARC Testnet enabled</p>
    </div>
  `;
}

// Screen 2 - Main Betting Screen
async function showScreen2() {
  document.getElementById('app').innerHTML = `
    <div class="container">
      <h1>PREDICT ETH PRICES</h1>
      <h2>ON ARC</h2>

      <!-- BET AMOUNT -->
      <h2>BET AMOUNT</h2>
      <div style="display:flex;gap:10px;justify-content:center">
        <div class="option-btn ${currentBet.amount===1?'active':''}" onclick="selectAmount(1)">1 USDC</div>
        <div class="option-btn ${currentBet.amount===5?'active':''}" onclick="selectAmount(5)">5 USDC</div>
        <div class="option-btn ${currentBet.amount===10?'active':''}" onclick="selectAmount(10)">10 USDC</div>
      </div>

      <!-- TIME FRAME -->
      <h2>TIME FRAME</h2>
      <div style="display:flex;gap:10px;justify-content:center">
        <div class="option-btn ${currentBet.time===10?'active':''}" onclick="selectTime(10)">10 SECONDS</div>
        <div class="option-btn ${currentBet.time===30?'active':''}" onclick="selectTime(30)">30 SECONDS</div>
        <div class="option-btn ${currentBet.time===60?'active':''}" onclick="selectTime(60)">60 SECONDS</div>
      </div>

      <!-- PREDICTION -->
      <h2>PREDICTION</h2>
      <div style="display:flex;gap:10px;justify-content:center">
        <div class="option-btn ${currentBet.direction==='HIGHER'?'active':''}" onclick="selectDirection('HIGHER')">HIGHER</div>
        <div class="option-btn ${currentBet.direction==='LOWER'?'active':''}" onclick="selectDirection('LOWER')">LOWER</div>
      </div>

      <!-- LIVE PRICE -->
      <h2>ETH LIVE PRICE</h2>
      <input type="text" id="livePrice1" class="readonly" value="Loading..." readonly>
      <input type="text" id="livePrice2" class="readonly" value="0.00" readonly>

      <button class="btn" onclick="settleAndPredict()" style="margin-top:20px">SETTLE & PAY ${currentBet.amount} USDC</button>

      <!-- Prediction Area -->
      <div id="predictionArea" style="margin-top:30px;display:none">
        <input type="text" id="countdown" class="readonly" value="0" readonly style="font-size:2.5rem">
        <button id="predictBtn" class="btn" onclick="startPrediction()" disabled>PREDICT</button>
      </div>
    </div>
  `;

  // Start live price
  setInterval(() => updateLivePrice('livePrice1'), 5000);
  updateLivePrice('livePrice1');
}

window.selectAmount = (amt) => { currentBet.amount = amt; showScreen2(); };
window.selectTime = (t) => { currentBet.time = t; showScreen2(); };
window.selectDirection = (dir) => { currentBet.direction = dir; showScreen2(); };

async function settleAndPredict() {
  if (!signer) return alert("Wallet not connected");

  // In real app: check USDC balance + transfer
  alert(`Paying ${currentBet.amount} USDC... (demo)`);
  // TODO: Actual transfer with ethers

  document.getElementById('predictionArea').style.display = 'block';
  document.getElementById('predictBtn').disabled = false;
}

function startPrediction() {
  startPrice = currentETHPrice;
  document.getElementById('livePrice1').value = startPrice.toFixed(2);

  let timeLeft = currentBet.time;
  document.getElementById('countdown').value = timeLeft;

  countdownInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('countdown').value = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      endGame();
    }
  }, 1000);
}

async function endGame() {
  endPrice = await getETHPrice();
  document.getElementById('livePrice2').value = endPrice.toFixed(2);

  const won = (currentBet.direction === "HIGHER" && endPrice > startPrice) ||
              (currentBet.direction === "LOWER" && endPrice < startPrice);

  showResultScreen(won);
}

function showResultScreen(won) {
  document.getElementById('app').innerHTML = `
    <div style="height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px">
      <h1 style="font-size:4rem;color:${won?'green':'red'}">
        ${won ? "YOU WON!" : "YOU LOSE"}
      </h1>
      <button class="btn" onclick="${won ? 'claimWin()' : 'resetToScreen2()'}" style="padding:20px 60px">
        ${won ? 'CLAIM 2x REWARD' : 'PLAY AGAIN'}
      </button>
    </div>
  `;
}

window.claimWin = () => {
  alert("✅ Reward sent to your wallet (backend simulation)");
  resetToScreen2();
};

function resetToScreen2() {
  showScreen2();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  showScreen1();
});

window.connectWallet = connectWallet;