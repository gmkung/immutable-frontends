
import { Web3 } from "web3";
import { toast } from "sonner";
import LCURATE_ABI from "../../constants/lcurate_ABI.json";
import { REGISTRY_ADDRESS, ContractInstances } from "./types";

// Initialize Web3
let web3Instance: Web3 | null = null;
let registryInstance: any = null;

/**
 * Initialize Web3 connection and contract
 */
export async function initWeb3(): Promise<ContractInstances | null> {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const web3 = new Web3(window.ethereum);
      
      // Create contract instance with explicit types
      const registry = new web3.eth.Contract(
        LCURATE_ABI,
        REGISTRY_ADDRESS
      );
      
      // Cache instances
      web3Instance = web3;
      registryInstance = registry;
      
      return { web3, registry };
    } catch (error) {
      console.error("User denied account access", error);
      toast.error("Please connect your wallet to continue");
      return null;
    }
  } else {
    console.error("Ethereum provider not found");
    toast.error("Please install MetaMask or another Web3 wallet");
    return null;
  }
}

/**
 * Get the current Web3 and registry instances, initializing if needed
 */
export async function getWeb3Instances(): Promise<ContractInstances> {
  if (!web3Instance || !registryInstance) {
    const instances = await initWeb3();
    if (!instances) {
      throw new Error("Failed to initialize Web3");
    }
    return instances;
  }
  
  return { 
    web3: web3Instance, 
    registry: registryInstance 
  };
}

/**
 * Connect wallet and return the connected account
 */
export async function connectWallet(): Promise<string> {
  const { web3 } = await getWeb3Instances();
  
  try {
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please make sure your wallet is connected.");
    }
    
    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

/**
 * Get the current connected account if any
 */
export async function getCurrentAccount(): Promise<string | null> {
  if (typeof window.ethereum === 'undefined') {
    return null;
  }
  
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
}

/**
 * Format wallet address for display
 */
export function formatWalletAddress(address: string): string {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Switch to Ethereum mainnet
 */
export async function switchToMainnet(): Promise<void> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error("Ethereum provider not found. Please install MetaMask.");
  }
  
  try {
    // Switch to Ethereum mainnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }], // 0x1 is Ethereum mainnet
    });
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x1',
            chainName: 'Ethereum Mainnet',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://mainnet.infura.io/v3/'],
            blockExplorerUrls: ['https://etherscan.io'],
          },
        ],
      });
    } else {
      throw error;
    }
  }
}

/**
 * Handle common Web3 errors
 */
export function handleWeb3Error(error: any): string {
  console.error("Web3 error:", error);
  
  // Enhanced error handling for ABI errors specifically
  if (error.name === "AbiError" || (error.message && error.message.includes("ABI"))) {
    return "Contract interaction error: There might be an issue with the contract ABI or connection. Please try again later.";
  }
  
  // Handle common MetaMask errors
  if (error.code === 4001) {
    return "Transaction rejected by user";
  }
  
  if (error.code === -32603) {
    if (error.message && error.message.includes("insufficient funds")) {
      return "Insufficient funds for transaction";
    }
  }
  
  // Check if error is from MetaMask or other wallet
  if (error.message) {
    if (error.message.includes("User denied")) {
      return "Transaction rejected by user";
    }
    
    if (error.message.includes("nonce too low")) {
      return "Transaction error: nonce too low. Try refreshing the page.";
    }
    
    // Return the error message if it's reasonably short
    if (error.message.length < 100) {
      return error.message;
    }
  }
  
  return "An error occurred while processing your transaction";
}
