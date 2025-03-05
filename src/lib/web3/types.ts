
import { Web3, Contract } from "web3";

// Global Ethereum interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface DepositDetails {
  depositAmount: string;
  breakdown: {
    submissionBaseDeposit: string;
    arbitrationCost: string;
    total: string;
  };
  challengePeriodDays: number;
}

export interface ContractInstances {
  web3: Web3;
  registry: Contract;
}

// Type for arbitrator ABI
export const arbitratorABI = [
  {
    constant: true,
    inputs: [{ name: "_extraData", type: "bytes" }],
    name: "arbitrationCost",
    outputs: [{ name: "cost", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

// Constants
export const REGISTRY_ADDRESS = "0xbcff87C2BdC8E3e29811e7AC5A631F0CdEc9CeD8";
export const CHALLENGE_PERIOD_DAYS = 7;
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
