# Blockchain Secure Patient Records - Wide Format Flow

```mermaid
flowchart LR
    Start([Patient Completes Workout]) --> AI[AI Analyzes Form]
    AI --> Risk{Injury Risks?}
    Risk -->|Yes| FlagRisks[Flag Issues]
    Risk -->|No| Basic[Basic Record]
    FlagRisks --> Encrypt[/Encrypt AES-256/]
    Basic --> Encrypt
    Encrypt --> Hash{{Generate Hash}}
    Hash --> Store[(Firestore)]
    Store --> BC[Ethereum Goerli]
    
    AccessStart([Doctor/Patient Access]) --> Auth{Private Key}
    Auth -->|Valid| Verify[Verify Integrity]
    Auth -->|Invalid| Deny[X Denied]
    Verify --> Display>Display Records]
    Display --> End([Complete])
    
    %% Styling with varied colors
    classDef main fill:#4A90E2,stroke:#2C5F8D,stroke-width:3px,color:#fff
    classDef decision fill:#F5A623,stroke:#D17E00,stroke-width:3px,color:#fff
    classDef store fill:#50C878,stroke:#2E7D4E,stroke-width:3px,color:#fff
    classDef start fill:#9B59B6,stroke:#6A4C93,stroke-width:3px,color:#fff
    classDef highlight fill:#E74C3C,stroke:#C0392B,stroke-width:3px,color:#fff
    classDef process fill:#16A085,stroke:#0E6655,stroke-width:3px,color:#fff
    classDef verify fill:#8E44AD,stroke:#6C3483,stroke-width:3px,color:#fff
    
    class AI,BC,Display main
    class Risk,Auth decision
    class Store store
    class Start,AccessStart,End start
    class FlagRisks,Basic highlight
    class Encrypt process
    class Hash,Verify verify
    class Deny highlight
```

## How to Download the Image

### Option 1: Mermaid Live Editor (Recommended - Easiest)
1. Go to https://mermaid.live/
2. Copy and paste the Mermaid code (everything between the ```mermaid and ``` markers)
3. The diagram will render automatically
4. Click the **"Actions"** button (top right)
5. Select **"Download PNG"** or **"Download SVG"**

### Option 2: Using Mermaid CLI (Command Line)
If you have Node.js installed:
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i BLOCKCHAIN_FLOWCHART_WIDE.md -o blockchain_flowchart.png -b transparent
```

### Option 3: GitHub Rendering + Screenshot
1. View the file on GitHub: https://github.com/majidsafwaan2/gymguard/blob/main/BLOCKCHAIN_FLOWCHART_WIDE.md
2. The diagram will render automatically on GitHub
3. Take a screenshot of the rendered diagram

### Option 4: VS Code Extension
1. Install the "Markdown Preview Mermaid Support" extension
2. Open the `.md` file in VS Code
3. Right-click the rendered diagram
4. Select "Copy Image" or "Save Image"

