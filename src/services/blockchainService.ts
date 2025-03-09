
import { ethers } from 'ethers';
import { toast } from '@/components/ui/use-toast';

// Constants for blockchain interaction
const FLARE_RPC_URL = 'https://flare-api.flare.network/ext/C/rpc';
const EAS_CONTRACT_ADDRESS = '0xae92E5756FC2040701A73B60B4439457F10841cB'; // Flare EAS address
const FDC_SCHEMA_UID = '0x7e25b8ec4de5cfa6c60311c6be58b20be5cb8956311a39f8d15c7ba9e5c34bc9'; // Flare Data Connector schema

/**
 * Records data on the Flare blockchain by creating a transaction
 * @param privateKey The user's private key
 * @param queryText The query text
 * @param responseText The consensus response text
 * @returns Transaction hash
 */
export const recordOnFlareBlockchain = async (
  privateKey: string,
  queryText: string,
  responseText: string
): Promise<string> => {
  try {
    console.log('=== RECORDING ON FLARE BLOCKCHAIN ===');
    
    // Create provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(FLARE_RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Create transaction data
    const timestamp = Date.now();
    // Calculate hashes using keccak256 (Ethereum standard hashing)
    const queryHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(queryText));
    const responseHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(responseText));
    
    // Create transaction data object
    const data = ethers.utils.hexlify(
      ethers.utils.concat([
        ethers.utils.toUtf8Bytes('TRUTHFUL_DATA:'),
        ethers.utils.arrayify(queryHash),
        ethers.utils.arrayify(responseHash),
        ethers.utils.hexZeroPad(ethers.utils.hexlify(timestamp), 32)
      ])
    );
    
    // Create and send transaction
    const tx = await wallet.sendTransaction({
      to: wallet.address, // Send to self (could be a smart contract in future)
      value: ethers.utils.parseEther('0'), // No ETH value
      data: data,
      gasLimit: 100000 // Set appropriate gas limit
    });
    
    console.log('Transaction submitted:', tx.hash);
    
    // Wait for transaction confirmation
    await tx.wait(1);
    console.log('Transaction confirmed');
    
    return tx.hash;
  } catch (error) {
    console.error('Error recording on Flare blockchain:', error);
    toast({
      title: "Blockchain Error",
      description: "Failed to record on Flare blockchain. Please check your wallet key.",
      variant: "destructive",
    });
    throw new Error('Failed to record on Flare blockchain');
  }
};

/**
 * Creates an attestation using Ethereum Attestation Service (EAS)
 * @param privateKey The user's private key
 * @param queryText The query text
 * @param responseText The consensus response text
 * @returns Attestation UID
 */
export const createAttestation = async (
  privateKey: string,
  queryText: string,
  responseText: string
): Promise<string> => {
  try {
    console.log('=== CREATING EAS ATTESTATION ===');
    
    // Create provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(FLARE_RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Simple EAS ABI for the attest function
    const easAbi = [
      "function attest(tuple(bytes32 schema, tuple(address recipient, uint64 expirationTime, bool revocable, bytes data) data)) external payable returns (bytes32)"
    ];
    
    // Create EAS contract instance
    const easContract = new ethers.Contract(EAS_CONTRACT_ADDRESS, easAbi, wallet);
    
    // Prepare attestation data (query and response strings)
    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ['string', 'string', 'uint256'],
      [queryText, responseText, Date.now()]
    );
    
    // Create attestation
    const attestationData = {
      schema: FDC_SCHEMA_UID,
      data: {
        recipient: ethers.constants.AddressZero, // No specific recipient
        expirationTime: 0, // No expiration
        revocable: false, // Cannot be revoked
        data: encodedData
      }
    };
    
    // Send transaction to create attestation
    const tx = await easContract.attest(attestationData, {
      gasLimit: 500000 // Set appropriate gas limit
    });
    
    console.log('Attestation transaction submitted:', tx.hash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait(1);
    console.log('Attestation transaction confirmed');
    
    // Extract attestation UID from event logs (simplified logic)
    // In a real implementation, you would parse the events properly
    // Here we're returning the transaction hash as a placeholder
    const attestationUID = receipt.transactionHash;
    console.log('Attestation UID:', attestationUID);
    
    return attestationUID;
  } catch (error) {
    console.error('Error creating EAS attestation:', error);
    toast({
      title: "Attestation Error",
      description: "Failed to create EAS attestation. Please check your wallet key.",
      variant: "destructive",
    });
    throw new Error('Failed to create EAS attestation');
  }
};

// Add Flare Data Connector verification functionality
export const verifyWithFlareDataConnector = async (
  responseText: string,
  sourceModelId: string
) => {
  try {
    console.log('=== VERIFYING WITH FLARE DATA CONNECTOR ===');
    console.log('Verifying response from model:', sourceModelId);
    
    // This would connect to the Flare Data Connector in a real implementation
    // For now, we'll simulate verification with randomness, biased towards positive verification
    
    // Calculate verification score (80% chance of verification)
    // In reality, this would be determined by the FDC consensus mechanism
    const verificationScore = Math.random();
    const isVerified = verificationScore >= 0.2; // 80% chance of verification
    
    console.log('Verification result:', isVerified ? 'VERIFIED' : 'NOT VERIFIED');
    console.log('Verification score:', verificationScore);
    
    return {
      isVerified,
      verificationScore,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error verifying with Flare Data Connector:', error);
    return {
      isVerified: false,
      verificationScore: 0,
      timestamp: Date.now(),
      error: 'Verification failed'
    };
  }
};
