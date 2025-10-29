# Blockchain Secure Patient Records - Simplified Flow

```mermaid
flowchart TD
    Start([Patient Completes Workout]) --> AI[AI Analyzes Form]
    AI --> Risk{Risk Detected?}
    Risk -->|Yes| Encrypt[Encrypt Data AES-256]
    Risk -->|No| Encrypt
    Encrypt --> Hash[Generate Blockchain Hash]
    Hash --> Store[(Store in Firestore)]
    Store --> BC[Post to Ethereum Goerli]
    
    Doctor([Doctor Opens Records]) --> Auth{Enter Private Key}
    Auth -->|Valid| View1[View All Patient Records]
    View1 --> Show1[Show Scores + Risks]
    
    Patient([Patient Opens Records]) --> View2[View Personal Records]
    View2 --> Show2[Show Workout History]
    
    Show1 --> Verify[Blockchain Verification]
    Show2 --> Verify
    Verify --> End([Data Integrity Confirmed])
    
    %% Styling
    classDef main fill:#4A90E2,stroke:#2C5F8D,stroke-width:3px,color:#fff
    classDef decision fill:#F5A623,stroke:#D17E00,stroke-width:3px,color:#fff
    classDef store fill:#50C878,stroke:#2E7D4E,stroke-width:3px,color:#fff
    classDef start fill:#9B59B6,stroke:#6A4C93,stroke-width:3px,color:#fff
    
    class AI,Encrypt,Hash,BC,View1,View2,Show1,Show2,Verify main
    class Risk,Auth decision
    class Store store
    class Start,Doctor,Patient,End start
```

## Key Components

1. **Patient Workout** → Form analysis with AI
2. **Risk Detection** → Flags injury concerns
3. **Encryption** → AES-256 for privacy
4. **Blockchain Hash** → SHA-256 for integrity
5. **Firestore Storage** → Secure database
6. **Ethereum Goerli** → Immutable verification
7. **Doctor Access** → Private key required
8. **Patient Access** → Direct view
9. **Verification** → Anti-tampering checks

