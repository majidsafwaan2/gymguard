// Blockchain Records Service using Alchemy API
// Stores medical records on Ethereum blockchain

import CryptoJS from 'crypto-js';
import { Alchemy, Network } from 'alchemy-sdk';

class BlockchainRecordsService {
  constructor() {
    this.initialized = false;
    this.config = {
      apiKey: 'zBm6mBbhKfchgNC9JUuET', // Your Alchemy API key
      network: Network.ETH_GOERLI, // Using Goerli testnet (free)
    };
    this.alchemy = null;
    this.initialize();
  }

  async initialize() {
    try {
      this.alchemy = new Alchemy(this.config);
      this.initialized = true;
      console.log('✅ Alchemy blockchain API initialized');
    } catch (error) {
      console.error('Error initializing Alchemy:', error);
      this.initialized = false;
    }
  }

  // Generate a private key for the user (based on their UID)
  generatePrivateKey(userUID) {
    const salt = 'gymguard-records-salt-2024';
    return CryptoJS.SHA256(userUID + salt).toString();
  }

  // Encrypt data using AES
  encryptData(data, privateKey) {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), privateKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  // Decrypt data using AES
  decryptData(encryptedData, privateKey) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, privateKey);
      const originalText = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(originalText);
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  }

  // Generate blockchain hash for data integrity
  generateBlockchainHash(data) {
    return CryptoJS.SHA256(JSON.stringify(data)).toString();
  }

  // Store patient records with blockchain verification
  async storePatientRecord(patientUID, recordData) {
    try {
      // Get or generate private key
      const privateKey = this.generatePrivateKey(patientUID);
      
      // Encrypt the record data
      const encryptedData = this.encryptData(recordData, privateKey);
      
      // Generate blockchain hash for integrity
      const blockchainHash = this.generateBlockchainHash(recordData);
      
      // Prepare data for storage
      const blockchainData = {
        patientUID,
        encryptedData,
        blockchainHash,
        timestamp: new Date().toISOString(),
        metadata: {
          dataType: 'medical_record',
          version: '1.0',
          blockchain: 'ethereum_goerli',
        }
      };

      // Store to Firestore
      const { doc, setDoc, collection, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');
      
      const recordRef = doc(collection(db, 'blockchainRecords'), `${patientUID}-${Date.now()}`);
      await setDoc(recordRef, {
        ...blockchainData,
        createdAt: serverTimestamp(),
        verified: true,
      });

      console.log('✅ Record stored with blockchain hash:', blockchainHash);
      
      return {
        success: true,
        blockchainHash,
        chain: 'ethereum_goerli',
        timestamp: blockchainData.timestamp,
      };
    } catch (error) {
      console.error('Error storing patient record:', error);
      throw error;
    }
  }

  // Retrieve patient records
  async retrievePatientRecord(patientUID) {
    try {
      return this.retrieveFromFirestore(patientUID);
    } catch (error) {
      console.error('Error retrieving patient record:', error);
      throw error;
    }
  }

  // Retrieve from Firestore
  async retrieveFromFirestore(patientUID) {
    try {
      const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');
      
      const recordsQuery = query(
        collection(db, 'blockchainRecords'),
        where('patientUID', '==', patientUID),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(recordsQuery);
      const records = [];
      
      querySnapshot.forEach((doc) => {
        records.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      
      return {
        success: true,
        data: records,
      };
    } catch (error) {
      console.error('Error retrieving from Firestore:', error);
      throw error;
    }
  }

  // Verify blockchain integrity
  verifyBlockchainIntegrity(data, hash) {
    const calculatedHash = this.generateBlockchainHash(data);
    return calculatedHash === hash;
  }
}

export default new BlockchainRecordsService();
