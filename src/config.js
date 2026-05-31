const CONFIG = {
  enabledChains: {
    "arc-testnet": true,
    "arc-mainnet": false,
    "base-sepolia": false,
    "base-mainnet": false,
  },

  chains: {
    "arc-testnet": {
      chainId: "0x4cef52",
      rpcUrl: "https://rpc.testnet.arc.network",
      name: "ARC Testnet",
      explorer: "https://testnet.arcscan.app",
      usdcAddress: "0x3600000000000000000000000000000000000000"
    },

    "arc-mainnet": {
      chainId: "...",
      rpcUrl: "...",
      name: "ARC Mainnet",
      explorer: "...",
      usdcAddress: "PUT_MAINNET_USDC_HERE"
    },

    "base-sepolia": {
      chainId: "0x14a34",
      rpcUrl: "https://sepolia.base.org",
      name: "Base Sepolia",
      explorer: "https://sepolia.basescan.org",
      usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
    },

    "base-mainnet": {
      chainId: "0x2105",
      rpcUrl: "https://mainnet.base.org",
      name: "Base Mainnet",
      explorer: "https://basescan.org",
      usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    }
  },

  defaultChain: "arc-testnet"
};

export default CONFIG;