
import { Web3, Contract } from "web3";
import { toast } from "sonner";
import LCURATE_ABI from "../constants/lcurate_ABI.json";

// Declare ethereum interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Constants
const REGISTRY_ADDRESS = "0xbcff87C2BdC8E3e29811e7AC5A631F0CdEc9CeD8"; // Main registry address
const CHALLENGE_PERIOD_DAYS = 7; // Default challenge period in days

// Initialize Web3
let web3: Web3 | null = null;
let registry: Contract<typeof LCURATE_ABI> | null = null;

async function initWeb3() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      web3 = new Web3(window.ethereum);
      registry = new web3.eth.Contract(LCURATE_ABI, REGISTRY_ADDRESS);
      
      return true;
    } catch (error) {
      console.error("User denied account access", error);
      toast.error("Please connect your wallet to continue");
      return false;
    }
  } else {
    console.error("Ethereum provider not found");
    toast.error("Please install MetaMask or another Web3 wallet");
    return false;
  }
}

export async function getSubmissionDepositAmount() {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    if (!registry) throw new Error("Registry not initialized");
    
    // Get the submission base deposit
    const baseDeposit = await registry.methods.submissionBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    // Create arbitrator contract instance
    const arbitratorABI = [{"constant":true,"inputs":[{"name":"_extraData","type":"bytes"}],"name":"arbitrationCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
    
    // Make sure arbitrator is a valid address
    if (!arbitrator || arbitrator === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid arbitrator address");
    }
    
    const arbitratorContract = new web3!.eth.Contract(
      arbitratorABI,
      arbitrator
    );
    
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDeposit.toString()) + BigInt(arbitrationCost.toString());
    
    // Convert from wei to ETH with 3 decimal places
    const depositInEth = web3!.utils.fromWei(totalDeposit.toString(), 'ether');
    const formattedDeposit = parseFloat(depositInEth).toFixed(3);
    
    // Return formatted values for UI
    return {
      depositAmount: formattedDeposit,
      breakdown: {
        submissionBaseDeposit: web3!.utils.fromWei(baseDeposit.toString(), 'ether'),
        arbitrationCost: web3!.utils.fromWei(arbitrationCost.toString(), 'ether'),
        total: formattedDeposit
      },
      challengePeriodDays: CHALLENGE_PERIOD_DAYS
    };
  } catch (error) {
    console.error("Error getting submission deposit amount:", error);
    throw error;
  }
}

export async function getSubmissionChallengeDepositAmount() {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    if (!registry) throw new Error("Registry not initialized");
    
    // Get the submission challenge base deposit
    const baseDeposit = await registry.methods.submissionChallengeBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    // Create arbitrator contract instance
    const arbitratorABI = [{"constant":true,"inputs":[{"name":"_extraData","type":"bytes"}],"name":"arbitrationCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
    
    if (!arbitrator || arbitrator === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid arbitrator address");
    }
    
    const arbitratorContract = new web3!.eth.Contract(
      arbitratorABI,
      arbitrator
    );
    
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDeposit.toString()) + BigInt(arbitrationCost.toString());
    
    // Convert from wei to ETH with 3 decimal places
    const depositInEth = web3!.utils.fromWei(totalDeposit.toString(), 'ether');
    const formattedDeposit = parseFloat(depositInEth).toFixed(3);
    
    return formattedDeposit;
  } catch (error) {
    console.error("Error getting submission challenge deposit amount:", error);
    throw error;
  }
}

export async function getRemovalDepositAmount() {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    if (!registry) throw new Error("Registry not initialized");
    
    // Get the removal base deposit
    const baseDeposit = await registry.methods.removalBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    // Create arbitrator contract instance
    const arbitratorABI = [{"constant":true,"inputs":[{"name":"_extraData","type":"bytes"}],"name":"arbitrationCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
    
    if (!arbitrator || arbitrator === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid arbitrator address");
    }
    
    const arbitratorContract = new web3!.eth.Contract(
      arbitratorABI,
      arbitrator
    );
    
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDeposit.toString()) + BigInt(arbitrationCost.toString());
    
    // Convert from wei to ETH with 3 decimal places
    const depositInEth = web3!.utils.fromWei(totalDeposit.toString(), 'ether');
    const formattedDeposit = parseFloat(depositInEth).toFixed(3);
    
    return formattedDeposit;
  } catch (error) {
    console.error("Error getting removal deposit amount:", error);
    throw error;
  }
}

export async function getRemovalChallengeDepositAmount() {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    if (!registry) throw new Error("Registry not initialized");
    
    // Get the removal challenge base deposit
    const baseDeposit = await registry.methods.removalChallengeBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    // Create arbitrator contract instance
    const arbitratorABI = [{"constant":true,"inputs":[{"name":"_extraData","type":"bytes"}],"name":"arbitrationCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
    
    if (!arbitrator || arbitrator === '0x0000000000000000000000000000000000000000') {
      throw new Error("Invalid arbitrator address");
    }
    
    const arbitratorContract = new web3!.eth.Contract(
      arbitratorABI,
      arbitrator
    );
    
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDeposit.toString()) + BigInt(arbitrationCost.toString());
    
    // Convert from wei to ETH with 3 decimal places
    const depositInEth = web3!.utils.fromWei(totalDeposit.toString(), 'ether');
    const formattedDeposit = parseFloat(depositInEth).toFixed(3);
    
    return formattedDeposit;
  } catch (error) {
    console.error("Error getting removal challenge deposit amount:", error);
    throw error;
  }
}

// Function to remove an item from the registry
export async function removeItem(itemID: string, evidenceURI: string): Promise<void> {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    if (!registry) throw new Error("Registry not initialized");
    
    const accounts = await web3!.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No connected accounts found");
    }

    // Get required deposit amount
    const depositAmount = await getRemovalDepositAmount();
    if (!depositAmount) {
      throw new Error("Failed to retrieve deposit amount");
    }
    
    // Format evidence URI to match expected format
    const formattedEvidence = evidenceURI.startsWith('/ipfs/') 
      ? evidenceURI 
      : `/ipfs/${evidenceURI}`;
    
    // Convert ETH to Wei for the transaction
    const depositWei = web3!.utils.toWei(depositAmount, 'ether');
    
    // Submit transaction
    await registry.methods.removeItem(itemID, formattedEvidence).send({
      from: accounts[0],
      value: depositWei,
      gas: 500000 // Gas estimate as number
    });
    
  } catch (error) {
    console.error("Error removing item:", error);
    throw error;
  }
}

// Function to challenge a request
export async function challengeRequest(itemID: string, evidenceURI: string): Promise<void> {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    if (!registry) throw new Error("Registry not initialized");
    
    const accounts = await web3!.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No connected accounts found");
    }

    // Get item info to determine which deposit to use
    const itemInfo = await registry.methods.getItemInfo(itemID).call();
    if (!itemInfo) {
      throw new Error("Could not retrieve item information");
    }
    
    // Safely get the number of requests
    const requestID = parseInt(itemInfo.numberOfRequests?.toString() || "0") - 1;
    
    // Get request info
    const requestInfo = await registry.methods.getRequestInfo(itemID, requestID).call();
    if (!requestInfo) {
      throw new Error("Could not retrieve request information");
    }
    
    // Check if parties property exists and is an array
    if (!requestInfo.parties || !Array.isArray(requestInfo.parties)) {
      throw new Error("Invalid request info structure");
    }
    
    // Determine which deposit to use based on the current request status
    let depositAmount: string;
    // Check the zero address
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    
    // Safely access the parties array
    if (requestInfo.parties[1] === zeroAddress) {
      // This is a registration request (submitter is in position 0)
      depositAmount = await getSubmissionChallengeDepositAmount();
    } else {
      // This is a removal request (submitter is in position 1)
      depositAmount = await getRemovalChallengeDepositAmount();
    }

    if (!depositAmount) {
      throw new Error("Failed to retrieve deposit amount");
    }
    
    // Format evidence URI to match expected format
    const formattedEvidence = evidenceURI.startsWith('/ipfs/') 
      ? evidenceURI 
      : `/ipfs/${evidenceURI}`;
    
    // Convert ETH to Wei for the transaction
    const depositWei = web3!.utils.toWei(depositAmount, 'ether');
    
    // Submit transaction
    await registry.methods.challengeRequest(itemID, formattedEvidence).send({
      from: accounts[0],
      value: depositWei,
      gas: 500000 // Gas estimate as number
    });
    
  } catch (error) {
    console.error("Error challenging request:", error);
    throw error;
  }
}

export async function submitItem(itemString: string): Promise<void> {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    if (!registry) throw new Error("Registry not initialized");
    
    const accounts = await web3!.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No connected accounts found");
    }

    // Get required deposit amount
    const { depositAmount } = await getSubmissionDepositAmount();
    if (!depositAmount) {
      throw new Error("Failed to retrieve deposit amount");
    }

    // Convert ETH to Wei for the transaction
    const depositWei = web3!.utils.toWei(depositAmount, 'ether');

    // Submit transaction
    await registry.methods.addItem(itemString).send({
      from: accounts[0],
      value: depositWei,
      gas: 500000 // Gas estimate as number
    });
  } catch (error) {
    console.error("Error submitting item:", error);
    throw error;
  }
}

// Add missing exports needed by other components
export async function connectWallet(): Promise<string> {
  if (!web3) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }
  
  try {
    const accounts = await web3!.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please make sure your wallet is connected.");
    }
    
    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

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

export function formatWalletAddress(address: string): string {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

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

export async function submitToRegistry(ipfsHash: string): Promise<string> {
  try {
    await submitItem(ipfsHash);
    return "Transaction submitted successfully"; // Ideally this would return a transaction hash
  } catch (error) {
    console.error("Error submitting to registry:", error);
    throw error;
  }
}

export function handleWeb3Error(error: any): string {
  console.error("Web3 error:", error);
  
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
