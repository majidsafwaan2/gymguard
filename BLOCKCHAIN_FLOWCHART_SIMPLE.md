# Blockchain Secure Patient Records - Simplified Flow

```mermaid
flowchart LR
    Start([Patient Completes Workout]) --> AI[AI Analyzes Form]
    AI --> Encrypt[Encrypt with AES-256]
    Encrypt --> Store[(Store in Firestore)]
    Store --> BC[Post Hash to Ethereum]
    
    Start2([Doctor Opens Records]) --> Auth[Private Key Auth]
    Auth --> View1[View Patient Records]
    
    Start3([Patient Opens Records]) --> View2[View Personal Records]
    
    View1 --> Verify[Verify Integrity]
    View2 --> Verify
    Verify --> Show[Display Secure Records]
    Show --> End([Complete])
    
    %% Styling
    classDef main fill:#4A90E2,stroke:#2C5F8D,stroke-width:3px,color:#fff
    classDef store fill:#50C878,stroke:#2E7D4E,stroke-width:3px,color:#fff
    classDef start fill:#9B59B6,stroke:#6A4C93,stroke-width:3px,color:#fff
    
    class AI,Encrypt,BC,Auth,View1,View2,Verify,Show main
    class Store store
    class Start,Start2,Start3,End start
```

## Simplified Flow (10 Elements)

1. **Patient Completes Workout** → Starting point
2. **AI Analyzes Form** → Automated analysis
3. **Encrypt with AES-256** → Privacy protection
4. **Store in Firestore** → Database storage
5. **Post Hash to Ethereum** → Blockchain integrity
6. **Doctor Opens Records** → Requires authentication
7. **Patient Opens Records** → Direct access
8. **Verify Integrity** → Anti-tampering check
9. **Display Secure Records** → User view
10. **Complete** → End state

