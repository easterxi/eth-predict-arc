import { createEthersAdapterFromProvider } from "@circle-fin/adapter-ethers-v6";

export async function getArcAdapter() {
  if (!window.ethereum) {
    throw new Error("No wallet provider found");
  }

  return await createEthersAdapterFromProvider({
    provider: window.ethereum,
  });
}