# Theravive System Architecture Flowchart

```mermaid
flowchart TD
    Login([Login])
    
    Login --> PatientHome
    Login --> DoctorHome
    
    subgraph PatientSwimlane[" "]
        direction TB
        style PatientSwimlane fill:#00CED1,stroke:#008B8B,stroke-width:3px
        
        PatientHome[Patient Homepage]
        Setting[Setting]
        Exercise[Exercise]
        AIPose["AI-Pose Module<br/>MediaPipe + Angle Tracking"]
        DocFeedback[Doctor Feedback]
        
        PatientHome --> Setting
        PatientHome --> Exercise
        Exercise -->|Session Data/Metrics| AIPose
        AIPose -->|Session Data/Metrics| CloudDB
        DocFeedback --> PatientHome
    end
    
    subgraph DoctorSwimlane[" "]
        direction TB
        style DoctorSwimlane fill:#FFB6C1,stroke:#DC143C,stroke-width:3px
        
        DoctorHome[Doctor Homepage]
        PatientList["Patient List<br/>• Patient #1<br/>• Patient n<br/>• Patient #N"]
        ViewResults[View Test Results]
        Assignment[Assignment]
        ProvideFeedback[Provide Feedback]
        
        DoctorHome --> PatientList
        PatientList --> ViewResults
        ViewResults --> Assignment
        Assignment --> ProvideFeedback
    end
    
    subgraph CloudCluster["Cloud Database"]
        direction TB
        style CloudCluster fill:#E6E6FA,stroke:#9370DB,stroke-width:3px
        
        CloudDB[(Cloud Database)]
        AIModel[AI-Evaluation Model]
        
        CloudDB --> AIModel
    end
    
    %% Patient to Cloud - Blue links (Session Data/Metrics)
    Exercise -.->|"Session Data/Metrics"| CloudDB
    AIPose -.->|"Session Data/Metrics"| CloudDB
    
    %% AI Model Outputs - Orange links (Landmarks/Angles)
    AIModel ==>|"Model Outputs<br/>Landmarks/Angles"| AIPose
    
    %% Cloud to Doctor - Doctor reads results
    CloudDB -->|"Read Results"| ViewResults
    
    %% Doctor to Cloud - Send Assignment and Feedback
    ProvideFeedback -->|"Send Assignment"| CloudDB
    ProvideFeedback -->|"Send Feedback"| CloudDB
    
    %% Cloud to Patient - Green links (Feedback Summary)
    CloudDB -.->|"Feedback Summary"| DocFeedback
    
    %% Cross-lane: Assignment to Patient Exercise
    Assignment -->|"Assignment"| Exercise
    
    %% Styling - Node backgrounds (soft panels)
    classDef patientNode fill:#B0E0E6,stroke:#4682B4,stroke-width:2px,color:#000
    classDef doctorNode fill:#FFC0CB,stroke:#CD5C5C,stroke-width:2px,color:#000
    classDef cloudNode fill:#F5F5DC,stroke:#8B7355,stroke-width:2px,color:#000
    
    class PatientHome,Setting,Exercise,AIPose,DocFeedback patientNode
    class DoctorHome,PatientList,ViewResults,Assignment,ProvideFeedback doctorNode
    class CloudDB,AIModel cloudNode
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

