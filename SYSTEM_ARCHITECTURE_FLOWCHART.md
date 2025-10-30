# Theravive System Architecture Flowchart

```mermaid
flowchart LR
    Login([Login]) --> Patient[Patient Homepage]
    Login --> Doctor[Doctor Homepage]
    
    Patient --> Exercise[Exercise]
    Exercise --> AIPose["AI-Pose<br/>MediaPipe + Angles"]
    AIPose --> Cloud[(Cloud Database)]
    
    Cloud --> ViewResults[View Results]
    Doctor --> ViewResults
    ViewResults --> Assignment[Assignment]
    Assignment --> Feedback[Provide Feedback]
    
    Feedback --> Cloud
    Cloud --> Patient
    
    Assignment --> Exercise
    
    %% Styling - matching blockchain flowchart style
    classDef main fill:#4A90E2,stroke:#2C5F8D,stroke-width:3px,color:#fff
    classDef store fill:#50C878,stroke:#2E7D4E,stroke-width:3px,color:#fff
    classDef start fill:#9B59B6,stroke:#6A4C93,stroke-width:3px,color:#fff
    classDef process fill:#16A085,stroke:#0E6655,stroke-width:3px,color:#fff
    classDef highlight fill:#E74C3C,stroke:#C0392B,stroke-width:3px,color:#fff
    
    class Patient,Exercise,Doctor,ViewResults main
    class Cloud store
    class Login start
    class AIPose process
    class Assignment,Feedback highlight
```

## Link Color Legend

- **Solid arrows** (`-->`): Primary flows (Assignments, Results, Feedback)
- **Dashed arrows** (`-.->`): Session data/metrics flow (Blue)
- **Thick arrows** (`==>`): Model outputs - Landmarks/Angles (Orange)
- **Dotted from Cloud** (`-.->`): Feedback Summary flow (Green)

## Flow Description

1. **Login** branches to Patient Homepage (teal) or Doctor Homepage (pink)
2. **Patient Lane (Teal)**:
   - Settings and Exercise options
   - Exercise → AI-Pose Module (MediaPipe + angle tracking)
   - Both send session data/metrics to Cloud Database
   - Receives summarized Doctor Feedback

3. **Doctor Lane (Pink)**:
   - Patient List → View Test Results → Assignment → Provide Feedback
   - Reads results from Cloud Database
   - Sends new Assignments and Feedback to Cloud

4. **Cloud Database Cluster**:
   - Stores all session data/metrics
   - Runs AI-Evaluation Model
   - Routes feedback between doctor and patient

5. **Cross-Lane Flow**: Assignment from Doctor directly links to Patient's Exercise

