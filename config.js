const CONFIG = {
  enabledChains: {
    "arc-testnet": true,
    "eth-sepolia": false,
    "base-sepolia": false,
    "eth-mainnet": false,
    "base-mainnet": false
  },

  chains: {
    "arc-testnet": {
      chainId: "0x4cef52", // 5042002 in hex
      rpcUrl: "https://rpc.testnet.arc.network",
      name: "ARC Testnet",
      currency: "USDC",
      explorer: "https://testnet.arcscan.app",
      // USDC is native gas token on ARC - use zero address or native transfer for simplicity
      usdcAddress: "0x0000000000000000000000000000000000000000" // native
    }
  },

  defaultChain: "arc-testnet"
};

export default CONFIG;