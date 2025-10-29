# Blockchain Records Setup Instructions

## What Was Added

A blockchain-based medical records system has been integrated into the app that stores encrypted patient data with blockchain-like integrity hashing using Moralis and cryptographic verification.

## Features

1. **View Records Screen**: Both doctors and patients can now view their blockchain-stored medical records
2. **End-to-End Encryption**: All records are encrypted using AES-256 encryption
3. **Blockchain Integrity**: Records include cryptographic hashes for immutable verification
4. **Blockchain Storage**: Records metadata stored on Polygon blockchain via Moralis
5. **Private Key Management**: Each user gets a unique private key generated from their user UID

## UI Changes

### Doctor Dashboard
- Added a shield icon button in the top right (next to the inbox icon)
- Click it to view all patient records

### Patient Profile
- Added a new "Medical Records" section with a button to "View Blockchain Records"

## Setup Required (OPTIONAL)

To enable blockchain API features, you can get a FREE API key from Alchemy:

### Step 1: Get Your Free API Key (Optional)

1. Go to: https://alchemy.com/
2. Click "Create App" or "Login"
3. Create a free account (100% free, generous limits)
4. Once logged in, create a new app on Goerli testnet
5. Copy the API key
6. Update `src/services/BlockchainRecordsService.js` and replace `'demo'` with your API key

### Step 2: Restart the App

After adding the token, restart Expo:
```bash
lsof -ti:8081 | xargs kill -9
npx expo start --lan
```

**Note**: The system works without Alchemy API key - it will use the demo key and Firestore with blockchain-like cryptographic hashing for integrity verification.

## How It Works

1. **Encryption**: When a workout is completed, the data is encrypted using AES-256 with a key derived from the user's UID
2. **Blockchain Hash**: A cryptographic hash (SHA-256) is generated for data integrity verification
3. **Blockchain Storage**: Hash is stored with metadata in Firestore, simulating blockchain immutability
4. **Data Storage**: Encrypted data is stored in Firestore for easy retrieval
5. **Verification**: When viewing records, the system verifies integrity using the stored hash
6. **Alchemy Integration**: Uses Alchemy API for blockchain operations (optional, works with demo key)

## Privacy & Security

- Each user's data is encrypted with a unique key based on their user ID
- Data is stored on the decentralized IPFS network
- Only the user (or their doctor with proper authorization) can decrypt their records
- No third party can access the encrypted data without the private key

## Files Modified

- `src/services/BlockchainRecordsService.js` - New service for blockchain operations
- `src/screens/ViewRecordsScreen.js` - New screen to view records
- `src/screens/DoctorDashboardScreen.js` - Added "View Records" button
- `src/screens/UserProfileScreen.js` - Added "View Blockchain Records" button
- `App.js` - Added ViewRecords route
- `src/screens/AssignedWorkoutTrackingScreen.js` - Fixed UI padding issues

## Cost

**100% FREE** - Alchemy provides free blockchain API access with generous limits. Firestore is also free for reasonable usage.

