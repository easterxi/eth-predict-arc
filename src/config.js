const CONFIG = {
  enabledChains: {
    "arc-testnet": true,
    "base-sepolia": true,
    "base-mainnet": false,
    "eth-sepolia": true,
    "ink-sepolia": true,
    "arbitrum-sepolia": true,
    "avalanche-fuji": true,
    "hyperevm-testnet": true,
    "unichain-sepolia": true
  },
  
  chains: {

"arc-testnet": {
  chainId: "0x13b2",
  rpcUrl: "https://arc-mainnet.g.alchemy.com/v2/alch_zi9KNxI-lf_brQVJMD-Dq",
  name: "ARC Mainnet",
  explorer: "https://explorer.arc.io",
  usdcAddress: "0x3600000000000000000000000000000000000000"
},

"eth-sepolia": {
  chainId: "0x1",
  rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/alch_zi9KNxI-lf_brQVJMD-Dq,
  name: "Ethereum Mainnet",
  explorer: "https://etherscan.io",
  usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
},

"arbitrum-sepolia": {
  chainId: "0xa4b1",
  rpcUrl: "https://arb-mainnet.g.alchemy.com/v2/alch_zi9KNxI-lf_brQVJMD-Dq",
  name: "Arbitrum One",
  explorer: "https://arbiscan.io",
  usdcAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"
},

"base-sepolia": {
  chainId: "0x2105",
  rpcUrl: "https://base-mainnet.g.alchemy.com/v2/alch_zi9KNxI-lf_brQVJMD-Dq",
  name: "Base Mainnet",
  explorer: "https://basescan.org",
  usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
},

"base-mainnet": {
  chainId: "0x2105",
  rpcUrl: "https://base-mainnet.g.alchemy.com/v2/alch_zi9KNxI-lf_brQVJMD-Dq",
  name: "Base Mainnet",
  explorer: "https://basescan.org",
  usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
},

"avalanche-fuji": {
  chainId: "0xa86a",
  rpcUrl: "https://avax-mainnet.g.alchemy.com/v2/alch_zi9KNxI-lf_brQVJMD-Dq",
  name: "Avalanche C-Chain",
  explorer: "https://explorer.avax.network/c-chain",
  usdcAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
},

"hyperevm-testnet": {
  chainId: "0x3e7",
  rpcUrl: "https://hyperliquid-mainnet.g.alchemy.com/v2/alch_zi9KNxI-lf_brQVJMD-Dq",
  name: "HyperEVM Mainnet",
  explorer: "https://hyperevmscan.io",
  usdcAddress: "0xb88339CB7199b77E23DB6E890353E22632Ba630f"
},

"unichain-sepolia": {
  chainId: "0x82",
  rpcUrl: "https://unichain-mainnet.g.alchemy.com/v2/alch_zi9KNxI-lf_brQVJMD-Dq",
  name: "Unichain Mainnet",
  explorer: "https://uniscan.xyz",
  usdcAddress: "0x078D782b760474a361dDA0AF3839290b0EF57AD6"
},

"ink-sepolia": {
  chainId: "0xdef1",
  rpcUrl: "https://ink-mainnet.g.alchemy.com/v2/alch_zi9KNxI-lf_brQVJMD-Dq",
  name: "Ink Mainnet",
  explorer: "https://explorer.inkonchain.com",
  usdcAddress: "0x2D270e6886d130D724215A266106e6832161EAEd"
}
  },

  defaultChain: "arc-testnet"
};

export default CONFIG;