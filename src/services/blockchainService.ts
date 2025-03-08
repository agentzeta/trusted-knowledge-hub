
import { ethers } from 'ethers';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { EAS } from '@ethereum-attestation-service/eas-sdk';

// Flare network configuration
const FLARE_RPC_URL = 'https://flare-api.flare.network/ext/C/rpc';
const FLARE_CHAIN_ID = 14;

// EAS configuration for Flare
const EAS_CONTRACT_ADDRESS = '0xAcCe4Fe9Ce2A6FE9af83e7CF321a3aBF27A7d10F'; // Example address, replace with actual
const EAS_SCHEMA_UID = '0x5ac1bf0a30e18d2f609641cd8683d9d4c966543e1a3a08ad6f2a1a0cad2dc05e'; // Example schema, replace with actual

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
    // This is a basic example - in production, you would use a smart contract
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
    
    // Initialize EAS SDK
    const eas = new EAS(EAS_CONTRACT_ADDRESS);
    
    // Manually create connect method to work with ethers v5
    // Instead of using eas.connect(wallet) which expects ethers v6
    const contract = new ethers.Contract(
      EAS_CONTRACT_ADDRESS,
      ['function attest(tuple(bytes32 schema, tuple(address recipient, uint64 expirationTime, bool revocable, bytes data) data)) public returns (bytes32)'],
      wallet
    );
    
    // Initialize schema encoder with the schema string
    const schemaEncoder = new SchemaEncoder('string query,string responseHash,uint256 timestamp');
    
    // Encode the data
    const encodedData = schemaEncoder.encodeData([
      { name: 'query', value: query, type: 'string' },
      { 
        name: 'responseHash', 
        value: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(response)), 
        type: 'string' 
      },
      { name: 'timestamp', value: BigInt(Math.floor(Date.now() / 1000)), type: 'uint256' }
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
    
    // Extract attestation ID from logs or transaction receipt
    // This is a simplified approach - actual implementation depends on EAS contract specifics
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
    
    // Create a simplified verification check without directly using the EAS SDK methods
    // This is a basic implementation that checks if the transaction exists
    const tx = await provider.getTransaction(attestationId);
    
    // If the transaction exists and was confirmed, consider it valid
    return !!tx && tx.confirmations > 0;
  } catch (error) {
    console.error('Error verifying attestation:', error);
    return false;
  }
};
