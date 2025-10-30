# Theravive System Architecture Flowchart

```mermaid
flowchart LR
    Login([Login]) --> PatientHome
    Login --> DoctorHome
    
    PatientHome[Patient Homepage] --> Setting[Setting]
    PatientHome --> Exercise[Exercise]
    Exercise --> AIPose["AI-Pose Module<br/>MediaPipe + Angle Tracking"]
    
    AIPose -.->|Session Data/Metrics| CloudDB[(Cloud Database)]
    Exercise -.->|Session Data/Metrics| CloudDB
    
    CloudDB --> AIModel[AI-Evaluation Model]
    AIModel ==>|Model Outputs<br/>Landmarks/Angles| AIPose
    
    CloudDB --> ViewResults[View Test Results]
    
    DoctorHome[Doctor Homepage] --> PatientList["Patient List<br/>Patient #1, n, #N"]
    PatientList --> ViewResults
    ViewResults --> Assignment[Assignment]
    Assignment --> ProvideFeedback[Provide Feedback]
    
    ProvideFeedback -->|Send Assignment| CloudDB
    ProvideFeedback -->|Send Feedback| CloudDB
    
    CloudDB -.->|Feedback Summary| DocFeedback[Doctor Feedback]
    DocFeedback --> PatientHome
    
    Assignment -->|Assignment| Exercise
    
    %% Styling - Node backgrounds (soft panels)
    classDef patientNode fill:#B0E0E6,stroke:#4682B4,stroke-width:3px,color:#000
    classDef doctorNode fill:#FFC0CB,stroke:#CD5C5C,stroke-width:3px,color:#000
    classDef cloudNode fill:#F5F5DC,stroke:#8B7355,stroke-width:3px,color:#000
    classDef start fill:#9B59B6,stroke:#6A4C93,stroke-width:3px,color:#fff
    
    class PatientHome,Setting,Exercise,AIPose,DocFeedback patientNode
    class DoctorHome,PatientList,ViewResults,Assignment,ProvideFeedback doctorNode
    class CloudDB,AIModel cloudNode
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

