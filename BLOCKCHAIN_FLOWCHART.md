# Blockchain Secure Patient Records - System Flow

```mermaid
flowchart TD
    Start([Patient Completes Workout]) --> Analyze[AI Form Analysis]
    
    Analyze --> Collect[Collect Scores & Feedback]
    Collect --> CheckRisks{Injury Risks Detected?}
    
    CheckRisks -->|Yes| FlagRisks[Flag Critical Issues]
    CheckRisks -->|No| StoreBasic[Store Basic Scores]
    FlagRisks --> CreateReport[Create Detailed Score Report]
    StoreBasic --> CreateReport
    
    CreateReport --> Encrypt[Generate Private Key<br/>SHA-256 User UID]
    Encrypt --> AES[Encrypt with AES-256]
    
    AES --> Hash[Generate Blockchain Hash<br/>SHA-256 JSON]
    Hash --> StoreFirestore[(Store in Firestore)]
    
    StoreFirestore --> Alchemy{Alchemy API Available?}
    Alchemy -->|Yes| PostHash[Post Hash to Ethereum Goerli]
    Alchemy -->|No| StoreLocal[Store Locally<br/>Demo Mode]
    
    PostHash --> SaveRef[Save Blockchain Reference]
    StoreLocal --> SaveRef
    SaveRef --> Complete([Record Complete])
    
    %% Doctor View Flow
    DoctorStart([Doctor: View Records]) --> AuthReq[Enter Private Key]
    AuthReq --> ValidateKey{Valid Key?}
    
    ValidateKey -->|No| ErrorAuth[Access Denied]
    ValidateKey -->|Yes| FetchFirestore[Fetch from Firestore]
    
    FetchFirestore --> FilterDocs[Filter by Doctor ID]
    FilterDocs --> DecryptDocs[Decrypt Records]
    DecryptDocs --> VerifyHash[Verify SHA-256 Hash]
    
    VerifyHash --> CheckIntegrity{Tampered?}
    CheckIntegrity -->|Yes| AlertTamper[⚠️ Data Integrity Failed]
    CheckIntegrity -->|No| DisplayRecords[Display Patient Records]
    
    DisplayRecords --> ShowScores[Show Individual Scores]
    DisplayRecords --> ShowRisks[Show Injury Risks]
    DisplayRecords --> ShowMetrics[Show Health Metrics]
    DisplayRecords --> ShowBC[Show Blockchain Metadata]
    
    %% Patient View Flow
    PatientStart([Patient: View Records]) --> FetchOwn[Fetch Own Records]
    FetchOwn --> Animation[Blockchain Retrieval Animation]
    Animation --> LoadData[Load from Firestore]
    
    LoadData --> DecryptOwn[Decrypt with Private Key]
    DecryptOwn --> VerifyOwn[Verify Integrity]
    
    VerifyOwn --> DisplayOwn[Display Personal Records]
    DisplayOwn --> ShowWorkouts[Show Completed Workouts]
    DisplayOwn --> ShowHealth[Show Health Metrics]
    DisplayOwn --> ShowUpdates[Show Recent Updates]
    
    %% Parallel elements
    ShowBC --> EndDoctor([Doctor View Complete])
    ShowUpdates --> EndPatient([Patient View Complete])
    
    %% Styling
    classDef processBox fill:#4A90E2,stroke:#2C5F8D,stroke-width:2px,color:#fff
    classDef decisionBox fill:#F5A623,stroke:#D17E00,stroke-width:2px,color:#fff
    classDef storeBox fill:#50C878,stroke:#2E7D4E,stroke-width:2px,color:#fff
    classDef errorBox fill:#FF6B6B,stroke:#C92A2A,stroke-width:2px,color:#fff
    classDef startEnd fill:#9B59B6,stroke:#6A4C93,stroke-width:2px,color:#fff
    
    class Analyze,Collect,FlagRisks,StoreBasic,CreateReport,Encrypt,AES,Hash,AuthReq,FetchFirestore,FilterDocs,DecryptDocs,DisplayRecords,ShowScores,ShowRisks,ShowMetrics,FetchOwn,Animation,LoadData,DecryptOwn,DisplayOwn,ShowWorkouts,ShowHealth,ShowUpdates processBox
    class CheckRisks,Alchemy,ValidateKey,CheckIntegrity decisionBox
    class StoreFirestore,PostHash,SaveRef storeBox
    class ErrorAuth,AlertTamper errorBox
    class Start,Complete,DoctorStart,PatientStart,EndDoctor,EndPatient startEnd
```

## System Components

### Key Processes
- **AES-256 Encryption**: Symmetric encryption algorithm
- **SHA-256 Hashing**: Cryptographic integrity verification
- **Private Key Generation**: User-specific key derivation
- **Blockchain Storage**: Ethereum Goerli testnet integration

### Decision Points
- **Injury Risk Detection**: Checks for critical form issues
- **API Availability**: Fallback to demo mode if unavailable
- **Authentication**: Doctor private key validation
- **Data Integrity**: Hash verification against tampering

### Data Storage
- **Firestore**: Primary encrypted data storage
- **Blockchain Testnet**: Immutable hash verification
- **Local Storage**: Demo mode fallback

---

## Visual Legend

- **Blue Boxes**: Processing steps
- **Yellow Diamonds**: Decision points
- **Green Cylinders**: Data storage
- **Red Boxes**: Error states
- **Purple Ovals**: Start/End points

