
import { ethers } from 'ethers';

// Flare TEE configuration
const FLARE_TEE_ENDPOINT = 'https://flare-tee-api.flare.network';
const FLARE_TEE_VERIFICATION_CONTRACT = '0x1234567890123456789012345678901234567890'; // Replace with actual contract address

/**
 * Submits AI model responses to the Flare TEE for secure consensus calculation
 * @param queryText The original query text
 * @param responses Array of responses from different AI models
 * @param privateKey User's private key for authentication
 * @returns Promise with the TEE verification result
 */
export const submitToFlareTee = async (
  queryText: string,
  responses: any[],
  privateKey: string
): Promise<{ 
  consensusResponse: string; 
  verificationId: string;
  signature: string;
}> => {
  try {
    console.log('Submitting responses to Flare TEE for secure consensus calculation');
    
    // Create payload for TEE
    const payload = {
      query: queryText,
      responses: responses.map(response => ({
        model: response.source,
        response: response.content,
        timestamp: response.timestamp
      })),
      timestamp: Date.now()
    };
    
    // Sign the payload to authenticate the request
    const wallet = new ethers.Wallet(privateKey);
    const payloadHash = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes(JSON.stringify(payload))
    );
    const signature = await wallet.signMessage(ethers.utils.arrayify(payloadHash));
    
    // Send to TEE endpoint
    const response = await fetch(`${FLARE_TEE_ENDPOINT}/verify-consensus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
        'X-Public-Address': wallet.address
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`TEE verification failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('TEE verification completed', result);
    
    return {
      consensusResponse: result.consensusResponse,
      verificationId: result.verificationId,
      signature: result.signature
    };
  } catch (error) {
    console.error('Error in Flare TEE verification:', error);
    throw new Error('Failed to verify consensus in TEE');
  }
};

/**
 * Verifies a TEE-generated consensus on the blockchain
 * @param verificationId The ID returned from the TEE
 * @param signature The signature returned from the TEE
 * @param privateKey User's private key
 * @returns Transaction hash of the verification
 */
export const verifyTeeConsensusOnChain = async (
  verificationId: string,
  signature: string,
  privateKey: string
): Promise<string> => {
  try {
    // Initialize the provider for Flare network
    const provider = new ethers.providers.JsonRpcProvider(
      'https://flare-api.flare.network/ext/C/rpc', 
      14 // Flare Chain ID
    );
    
    // Create a wallet with the private key
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Create contract instance for TEE verification
    const contract = new ethers.Contract(
      FLARE_TEE_VERIFICATION_CONTRACT,
      [
        'function verifyConsensus(string verificationId, bytes signature) public returns (bool)'
      ],
      wallet
    );
    
    // Submit verification to the contract
    const tx = await contract.verifyConsensus(verificationId, signature);
    console.log('TEE verification transaction sent:', tx.hash);
    
    // Wait for transaction to be mined
    await tx.wait();
    console.log('TEE verification confirmed on chain');
    
    return tx.hash;
  } catch (error) {
    console.error('Error verifying TEE consensus on chain:', error);
    throw new Error('Failed to verify TEE consensus on blockchain');
  }
};
