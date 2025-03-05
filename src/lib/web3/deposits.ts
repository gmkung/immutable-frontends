
import { getWeb3Instances } from "./core";
import { arbitratorABI, CHALLENGE_PERIOD_DAYS, ZERO_ADDRESS, DepositDetails } from "./types";

/**
 * Get deposit amount required for submissions
 */
export async function getSubmissionDepositAmount(): Promise<DepositDetails> {
  const { web3, registry } = await getWeb3Instances();

  try {
    // Get the submission base deposit
    const baseDeposit = await registry.methods.submissionBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    // Check if arbitrator address is valid
    if (!arbitrator || arbitrator === ZERO_ADDRESS) {
      throw new Error("Invalid arbitrator address");
    }
    
    // Create arbitrator contract instance with proper address
    const arbitratorContract = new web3.eth.Contract(
      arbitratorABI,
      arbitrator
    );
    
    // Get arbitration cost using extraData
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Ensure values are converted to strings before BigInt conversion
    const baseDepositStr = baseDeposit ? baseDeposit.toString() : "0";
    const arbitrationCostStr = arbitrationCost ? arbitrationCost.toString() : "0";
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDepositStr) + BigInt(arbitrationCostStr);
    
    // Convert from wei to ETH with 3 decimal places
    const depositInEth = web3.utils.fromWei(totalDeposit.toString(), 'ether');
    const formattedDeposit = parseFloat(depositInEth).toFixed(3);
    
    // Return formatted values for UI
    return {
      depositAmount: formattedDeposit,
      breakdown: {
        submissionBaseDeposit: web3.utils.fromWei(baseDepositStr, 'ether'),
        arbitrationCost: web3.utils.fromWei(arbitrationCostStr, 'ether'),
        total: formattedDeposit
      },
      challengePeriodDays: CHALLENGE_PERIOD_DAYS
    };
  } catch (error) {
    console.error("Error getting submission deposit amount:", error);
    throw error;
  }
}

/**
 * Get deposit amount required for submission challenges
 */
export async function getSubmissionChallengeDepositAmount(): Promise<string> {
  const { web3, registry } = await getWeb3Instances();

  try {
    // Get the submission challenge base deposit
    const baseDeposit = await registry.methods.submissionChallengeBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    // Check if arbitrator address is valid
    if (!arbitrator || arbitrator === ZERO_ADDRESS) {
      throw new Error("Invalid arbitrator address");
    }
    
    // Create arbitrator contract instance
    const arbitratorContract = new web3.eth.Contract(
      arbitratorABI,
      arbitrator
    );
    
    // Get arbitration cost using extraData
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Ensure values are converted to strings before BigInt conversion
    const baseDepositStr = baseDeposit ? baseDeposit.toString() : "0";
    const arbitrationCostStr = arbitrationCost ? arbitrationCost.toString() : "0";
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDepositStr) + BigInt(arbitrationCostStr);
    
    // Convert from wei to ETH with 3 decimal places
    const depositInEth = web3.utils.fromWei(totalDeposit.toString(), 'ether');
    const formattedDeposit = parseFloat(depositInEth).toFixed(3);
    
    return formattedDeposit;
  } catch (error) {
    console.error("Error getting submission challenge deposit amount:", error);
    throw error;
  }
}

/**
 * Get deposit amount required for removals
 */
export async function getRemovalDepositAmount(): Promise<string> {
  const { web3, registry } = await getWeb3Instances();

  try {
    // Get the removal base deposit
    const baseDeposit = await registry.methods.removalBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    // Check if arbitrator address is valid
    if (!arbitrator || arbitrator === ZERO_ADDRESS) {
      throw new Error("Invalid arbitrator address");
    }
    
    // Create arbitrator contract instance
    const arbitratorContract = new web3.eth.Contract(
      arbitratorABI,
      arbitrator
    );
    
    // Get arbitration cost using extraData
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Ensure values are converted to strings before BigInt conversion
    const baseDepositStr = baseDeposit ? baseDeposit.toString() : "0";
    const arbitrationCostStr = arbitrationCost ? arbitrationCost.toString() : "0";
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDepositStr) + BigInt(arbitrationCostStr);
    
    // Convert from wei to ETH with 3 decimal places
    const depositInEth = web3.utils.fromWei(totalDeposit.toString(), 'ether');
    const formattedDeposit = parseFloat(depositInEth).toFixed(3);
    
    return formattedDeposit;
  } catch (error) {
    console.error("Error getting removal deposit amount:", error);
    throw error;
  }
}

/**
 * Get deposit amount required for removal challenges
 */
export async function getRemovalChallengeDepositAmount(): Promise<string> {
  const { web3, registry } = await getWeb3Instances();

  try {
    // Get the removal challenge base deposit
    const baseDeposit = await registry.methods.removalChallengeBaseDeposit().call();
    
    // Get arbitration cost
    const arbitrator = await registry.methods.arbitrator().call();
    const arbitratorExtraData = await registry.methods.arbitratorExtraData().call();
    
    // Check if arbitrator address is valid
    if (!arbitrator || arbitrator === ZERO_ADDRESS) {
      throw new Error("Invalid arbitrator address");
    }
    
    // Create arbitrator contract instance
    const arbitratorContract = new web3.eth.Contract(
      arbitratorABI,
      arbitrator
    );
    
    // Get arbitration cost using extraData
    const arbitrationCost = await arbitratorContract.methods.arbitrationCost(arbitratorExtraData).call();
    
    // Ensure values are converted to strings before BigInt conversion
    const baseDepositStr = baseDeposit ? baseDeposit.toString() : "0";
    const arbitrationCostStr = arbitrationCost ? arbitrationCost.toString() : "0";
    
    // Calculate total deposit required
    const totalDeposit = BigInt(baseDepositStr) + BigInt(arbitrationCostStr);
    
    // Convert from wei to ETH with 3 decimal places
    const depositInEth = web3.utils.fromWei(totalDeposit.toString(), 'ether');
    const formattedDeposit = parseFloat(depositInEth).toFixed(3);
    
    return formattedDeposit;
  } catch (error) {
    console.error("Error getting removal challenge deposit amount:", error);
    throw error;
  }
}
