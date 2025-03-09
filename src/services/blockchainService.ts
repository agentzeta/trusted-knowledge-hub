
import { ethers } from 'ethers';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';

// Flare network configuration
const FLARE_RPC_URL = 'https://flare-api.flare.network/ext/C/rpc';
const FLARE_CHAIN_ID = 14;

// EAS configuration for Flare
// Note: These are example addresses - replace with actual values when available
const EAS_CONTRACT_ADDRESS = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'; // Flare EAS contract
const EAS_SCHEMA_UID = '0x46df939f1a5a33dcfcf7c2048b5a04440f05e3200077dbd86509b5e34f767721'; // Example schema

// Record consensus response on Flare blockchain
export const recordOnFlareBlockchain = async (
  privateKey: string,
  query: string,
  response: string
): Promise<string> => {
  try {
    // Initialize the provider
    const provider = new ethers.providers.JsonRpcProvider(FLARE_RPC_URL, FLARE_CHAIN_ID);
    
    // Create a wallet with the private key
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Simple transaction to record data on-chain
    const tx = await wallet.sendTransaction({
      to: ethers.constants.AddressZero, // Replace with your contract address
      value: ethers.utils.parseEther('0'),
      data: ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes(
          JSON.stringify({
            query,
            responseHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(response)),
            timestamp: Math.floor(Date.now() / 1000)
          })
        )
      ),
      gasLimit: 100000
    });
    
    // Wait for transaction to be mined
    await tx.wait();
    
    return tx.hash;
  } catch (error) {
    console.error('Error recording on Flare blockchain:', error);
    throw new Error('Failed to record on Flare blockchain');
  }
};

// Create attestation using Ethereum Attestation Service
export const createAttestation = async (
  privateKey: string,
  query: string,
  response: string
): Promise<string> => {
  try {
    // Initialize the provider
    const provider = new ethers.providers.JsonRpcProvider(FLARE_RPC_URL, FLARE_CHAIN_ID);
    
    // Create a wallet with the private key
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Manually create contract instance for EAS
    const contract = new ethers.Contract(
      EAS_CONTRACT_ADDRESS,
      ['function attest(tuple(bytes32 schema, tuple(address recipient, uint64 expirationTime, bool revocable, bytes data) data)) public returns (bytes32)'],
      wallet
    );
    
    // Initialize schema encoder with the schema string
    const schemaEncoder = new SchemaEncoder('string query,string responseHash,uint256 timestamp');
    
    // Current timestamp as BigInt
    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
    
    // Encode the data
    const encodedData = schemaEncoder.encodeData([
      { name: 'query', value: query, type: 'string' },
      { 
        name: 'responseHash', 
        value: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(response)), 
        type: 'string' 
      },
      { name: 'timestamp', value: currentTimestamp, type: 'uint256' }
    ]);
    
    // Create the attestation
    const tx = await contract.attest({
      schema: EAS_SCHEMA_UID,
      data: {
        recipient: ethers.constants.AddressZero, // No recipient
        expirationTime: BigInt(0), // No expiration
        revocable: true,
        data: encodedData
      }
    });
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    // Use transaction hash as the attestation identifier
    return receipt.transactionHash;
  } catch (error) {
    console.error('Error creating attestation:', error);
    throw new Error('Failed to create attestation');
  }
};

// Verify attestation
export const verifyAttestation = async (attestationId: string): Promise<boolean> => {
  try {
    // Initialize the provider
    const provider = new ethers.providers.JsonRpcProvider(FLARE_RPC_URL, FLARE_CHAIN_ID);
    
    // Basic verification by checking if the transaction exists and was confirmed
    const tx = await provider.getTransaction(attestationId);
    
    return !!tx && tx.confirmations > 0;
  } catch (error) {
    console.error('Error verifying attestation:', error);
    return false;
  }
};
