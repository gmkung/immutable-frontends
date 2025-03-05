import { Web3, Contract } from "web3";
import { toast } from "sonner";
import LCURATE_ABI from "../constants/lcurate_ABI.json";

// Constants
const REGISTRY_ADDRESS = "0xbcff87C2BdC8E3e29811e7AC5A631F0CdEc9CeD8"; // Main registry address

// Initialize Web3
let web3: Web3;
let registry: Contract<typeof LCURATE_ABI>;

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

export async function getSubmissionDepositAmount(): Promise<string> {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    // Get the submission base deposit
    const baseDeposit = await registry.methods.submissionBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    const arbitratorContract = new web3.eth.Contract(
      // Simplified Arbitrator ABI with just the arbitrationCost function
      [{"constant":true,"inputs":[{"name":"_extraData","type":"bytes"}],"name":"arbitrationCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],
      arbitrator
    );
    
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDeposit) + BigInt(arbitrationCost);
    
    return totalDeposit.toString();
  } catch (error) {
    console.error("Error getting submission deposit amount:", error);
    throw error;
  }
}

export async function getSubmissionChallengeDepositAmount(): Promise<string> {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    // Get the submission challenge base deposit
    const baseDeposit = await registry.methods.submissionChallengeBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    const arbitratorContract = new web3.eth.Contract(
      [{"constant":true,"inputs":[{"name":"_extraData","type":"bytes"}],"name":"arbitrationCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],
      arbitrator
    );
    
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDeposit) + BigInt(arbitrationCost);
    
    return totalDeposit.toString();
  } catch (error) {
    console.error("Error getting submission challenge deposit amount:", error);
    throw error;
  }
}

export async function getRemovalDepositAmount(): Promise<string> {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    // Get the removal base deposit
    const baseDeposit = await registry.methods.removalBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    const arbitratorContract = new web3.eth.Contract(
      [{"constant":true,"inputs":[{"name":"_extraData","type":"bytes"}],"name":"arbitrationCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],
      arbitrator
    );
    
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDeposit) + BigInt(arbitrationCost);
    
    return totalDeposit.toString();
  } catch (error) {
    console.error("Error getting removal deposit amount:", error);
    throw error;
  }
}

export async function getRemovalChallengeDepositAmount(): Promise<string> {
  if (!web3 || !registry) {
    const initialized = await initWeb3();
    if (!initialized) throw new Error("Failed to initialize Web3");
  }

  try {
    // Get the removal challenge base deposit
    const baseDeposit = await registry.methods.removalChallengeBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    const arbitratorContract = new web3.eth.Contract(
      [{"constant":true,"inputs":[{"name":"_extraData","type":"bytes"}],"name":"arbitrationCost","outputs":[{"name":"cost","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}],
      arbitrator
    );
    
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDeposit) + BigInt(arbitrationCost);
    
    return totalDeposit.toString();
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
    const accounts = await web3.eth.getAccounts();
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
    
    // Submit transaction
    await registry.methods.removeItem(itemID, formattedEvidence).send({
      from: accounts[0],
      value: depositAmount,
      gas: 500000 // Gas estimate
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
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No connected accounts found");
    }

    // Get item info to determine which deposit to use
    const itemInfo = await registry.methods.getItemInfo(itemID).call();
    const requestID = Number(itemInfo.numberOfRequests) - 1;
    
    // Get request info
    const requestInfo = await registry.methods.getRequestInfo(itemID, requestID).call();
    
    // Determine which deposit to use based on the current request status
    let depositAmount;
    if (requestInfo.parties[1] === "0x0000000000000000000000000000000000000000") {
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
    
    // Submit transaction
    await registry.methods.challengeRequest(itemID, formattedEvidence).send({
      from: accounts[0],
      value: depositAmount,
      gas: 500000 // Gas estimate
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
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No connected accounts found");
    }

    // Get required deposit amount
    const depositAmount = await getSubmissionDepositAmount();
    if (!depositAmount) {
      throw new Error("Failed to retrieve deposit amount");
    }

    // Submit transaction
    await registry.methods.addItem(itemString).send({
      from: accounts[0],
      value: depositAmount,
      gas: 500000 // Gas estimate
    });

  } catch (error) {
    console.error("Error submitting item:", error);
    throw error;
  }
}
