import { LightCurateRegistry, SUPPORTED_CHAINS } from "light-curate-data-service";

const CONTRACT_ADDRESS = "0xda03509Bb770061A61615AD8Fc8e1858520eBd86";

export const registry = new LightCurateRegistry(
  CONTRACT_ADDRESS,
  SUPPORTED_CHAINS.ETHEREUM_MAINNET
); 
console.log("Registry initialized: ",registry)