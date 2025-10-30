# Theravive System Architecture Flowchart

```mermaid
flowchart LR
    Login([Login]) --> Patient[Patient Homepage]
    Login --> Doctor[Doctor Homepage]
    
    Patient --> Exercise[Exercise]
    Exercise --> AIPose["AI-Pose<br/>MediaPipe + Angles"]
    
    AIPose --> Cloud[(Cloud Database)]
    Exercise --> Cloud
    
    Cloud --> ViewResults[View Results]
    
    Doctor --> ViewResults
    ViewResults --> Assignment[Assignment]
    Assignment --> Feedback[Provide Feedback]
    
    Feedback --> Cloud
    Cloud --> Patient
    
    Assignment --> Exercise
    
    %% Styling
    classDef patientNode fill:#B0E0E6,stroke:#4682B4,stroke-width:3px,color:#000
    classDef doctorNode fill:#FFC0CB,stroke:#CD5C5C,stroke-width:3px,color:#000
    classDef cloudNode fill:#F5F5DC,stroke:#8B7355,stroke-width:3px,color:#000
    classDef start fill:#9B59B6,stroke:#6A4C93,stroke-width:3px,color:#fff
    
    class Patient,Exercise,AIPose patientNode
    class Doctor,ViewResults,Assignment,Feedback doctorNode
    class Cloud cloudNode
    class Login start
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

