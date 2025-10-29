# Congressional App Challenge - Video Script
## Theravive: AI-Powered Physical Therapy & Injury Prevention Platform

**Total Duration: 3 minutes** | **Team: Saketh Nandam, Kavin Sandhu, Safwaan Majid**

---

## [00:00-00:15] OPENING: Athlete Interviews
**[Black screen with title: "We interviewed 8 athletes in our community who needed physical therapy after injury. Here's what they said their biggest challenge was:"]**

**[Quick cuts showing athletes with text overlay]**
- **Athlete 1:** "Cost"
- **Athlete 2:** "Commuting to clinic"
- **Athlete 3:** "Doctor availability"
- **Athlete 4:** "Time"
- **Athlete 5:** "Tracking progress"
- **Athlete 6:** "Accessibility"
- **Athlete 7:** "Follow-up care"
- **Athlete 8:** "Form monitoring"

---

## [00:15-00:40] PROBLEM & SOLUTION (Saketh)
**[Switch to slides]**

**SAKETH:** In our community, we've seen firsthand how student athletes struggle with physical therapy access. According to the National Athletic Trainers' Association, approximately 2 million high school student athletes suffer sports-related injuries each year. The National Center for Health Statistics reports that the average physical therapy session costs between $100-$150, creating financial barriers for many families.

**[Show slide 1: Statistics]**
**Slide Content:**
- **Title:** "The Physical Therapy Accessibility Crisis"
- **Statistic 1:** "2 million student athletes injured annually"
- **Source:** National Athletic Trainers' Association
- **Statistic 2:** "Average PT session: $100-$150"
- **Source:** National Center for Health Statistics
- **Graph:** Bar chart showing rising PT costs over past 5 years

**SAKETH:** What's more, a study published in the Journal of Pediatric Orthopaedics found that over 60% of student athletes discontinue physical therapy before completing their recommended treatment due to transportation and scheduling challenges. Our community needs a solution.

**[Show slide 2: Solution Overview]**

**SAKETH:** That's why we created Theravive—an AI-powered platform that brings professional physical therapy directly to our community through their phones. Our app combines real-time form analysis, secure doctor-patient connectivity, and blockchain-protected medical records to revolutionize how we access physical therapy.

**[Transition to app view]**

---

## [00:40-01:05] LOGIN SYSTEM & BACKEND (Saketh)
**[Show app - Login/Signup screen]**

**SAKETH:** Theravive features a dual-user system. Patients can sign up and request a specific doctor during registration, creating a direct connection pathway. Doctors sign up with their medical license information—and just to clarify, what you're seeing here is demo data, not real medical information.

**[Navigate through signup screens showing patient and doctor options]**
**[Show on screen: "DEMO DATA - NOT REAL MEDICAL LICENSE INFORMATION"]**

**SAKETH:** This creates a seamless connection between healthcare providers and their patients, enabling remote monitoring and care. All of this is powered by Google Firebase, our backend infrastructure. Let me show you how this works behind the scenes.

**[Switch to code view - show src/config/firebase.js]**

**SAKETH:** In our `firebase.js` configuration file, we've integrated Firebase Authentication for secure user login, Firestore database for storing patient records and workout assignments, and Firebase Storage for handling injury timeline photos. The Firebase SDK connects our React Native frontend to a real-time, scalable cloud backend that handles authentication, data synchronization, and secure data storage—exactly what we need for a healthcare application.

**[Switch back to app - show doctor accepting patient request]**

---

## [01:05-01:25] DOCTOR-PATIENT CONNECTIVITY (Saketh)
**[Show doctor dashboard accepting patient request]**

**SAKETH:** Once connected, doctors can assign personalized workout plans based on their patients' injuries. This connection happens through our `DoctorInboxScreen.js`, where patient requests are managed, and `WorkoutAssignmentScreen.js`, where doctors select exercises from our comprehensive database.

**[Show code - src/screens/WorkoutAssignmentScreen.js briefly]**

**SAKETH:** The assignment data is stored in Firestore collections, allowing real-time updates so patients see their new exercises immediately.

---

## [01:25-02:05] FORM TRACKER & POSE DETECTION (Kavin)
**[Switch to app - workout tracking screen]**

**KAVIN:** The core of Theravive is our AI form tracking system. Let me show you exactly how this works from a technical perspective.

**[Switch to code view - show src/utils/PoseDetector.js]**

**KAVIN:** In our `PoseDetector.js` file, we use feature extraction from MediaPipe to obtain the x,y coordinates of 17 key body points—shoulders, elbows, knees, ankles, and more. Then, we extract joint angles using trigonometric functions.

**[Zoom in on calculateAngle function - lines 72-80]**

**KAVIN:** Specifically, we use inverse trigonometric functions—implemented using Math.acos, which applies the arccosine function as part of the law of cosines—to calculate the angle between three points. We calculate the distances between points using the distance formula, then apply the law of cosines with arccosine to determine the joint angle in degrees. This trigonometric approach tells us exactly how bent someone's knee is, how aligned their spine is, and whether their form matches ideal biomechanical standards.

**[Switch to app - camera recording screen during workout]**

**KAVIN:** As patients perform assigned exercises, our system running in `AssignedWorkoutTrackingScreen.js` captures the pose data frame by frame. The AI analyzes stance width by comparing hip-to-ankle distances, checks depth by measuring knee angles, and monitors spinal alignment by tracking shoulder-to-hip relationships.

**[Show analysis screen with scores and feedback]**

**KAVIN:** After each set, patients receive detailed scores with specific, actionable feedback. For example, if someone's squat stance is too narrow, the app provides exact instructions: "Move your feet to shoulder-width distance to reduce knee strain." The system also flags potential injury risks, which are immediately sent to the assigned doctor through our Firestore backend.

**[Show code - src/screens/AssignedWorkoutTrackingScreen.js - finishWorkout function]**

**KAVIN:** When a workout is completed, the `finishWorkout` function generates a comprehensive score report including individual scores, critical issues, and injury risks—all structured data that gets saved to Firestore for the doctor to review.

---

## [02:05-02:25] BLOCKCHAIN SECURITY (Safwaan)
**[Switch to app - blockchain records view]**

**SAFWAAN:** But here's what makes Theravive truly innovative: all medical records are secured using blockchain technology. Every workout score, form analysis, and injury risk assessment is encrypted with AES-256 encryption and stored with a cryptographic hash on the Ethereum Goerli testnet.

**[Switch to code view - show src/services/BlockchainRecordsService.js]**

**SAFWAAN:** Our `BlockchainRecordsService.js` file handles everything. The `generatePrivateKey` function creates a unique key from each user's ID using SHA-256 hashing. The `encryptData` method uses AES-256 encryption from the CryptoJS library to protect patient data. Then `generateBlockchainHash` creates an immutable SHA-256 hash that proves data integrity.

**[Switch to blockchain flowchart slide]**

**SAFWAAN:** Here's the complete flow: When a patient completes a workout, our AI analyzes the form, the data gets encrypted with AES-256, and we generate a unique blockchain hash using the Alchemy SDK connected to Ethereum Goerli. Doctors access records through private key authentication implemented in `ViewRecordsScreen.js`, and all data integrity is verified before display using our `verifyBlockchainIntegrity` function. This creates an immutable, secure medical record system that meets healthcare privacy standards.

---

## [02:25-02:45] ADDITIONAL FEATURES (Kavin)
**[Navigate through app features]**

**KAVIN:** Beyond form tracking, Theravive includes an AI chatbot powered by Google's Gemini API, providing instant answers to exercise questions. You can see this in our `FloatingChatbot.js` component and `GeminiService.js`, which handles the AI responses.

**[Show code - src/components/FloatingChatbot.js briefly]**

**KAVIN:** The community feature, built in `SocialScreen.js` and `CommunityContext.js`, allows patients to share progress and connect with others on similar recovery journeys. Patients can also track their pain levels over time using `PainTrackingScreen.js`, creating a comprehensive health monitoring system that integrates with our Firebase backend.

---

## [02:45-03:00] FUTURE GOALS & IMPACT (Safwaan)
**[Show slides with social proof]**

**SAFWAAN:** We've already begun building our network with a TikTok social media presence and outreach emails to local physical therapy clinics. Our goal is to partner with healthcare providers in our community to expand access to quality physical therapy, especially for student athletes.

**[Show email examples/partnership outreach]**

**SAFWAAN:** Future improvements will include real-time voice feedback during exercises, advanced biomechanical analysis using additional MediaPipe features, and integration with wearable devices. By combining cutting-edge AI pose detection with secure blockchain technology, Theravive addresses the accessibility crisis in physical therapy for our community.

---

## [03:00] CLOSING (Team)
**[Show app logo or final screen]**

**TEAM:** Theravive—bringing professional physical therapy to your pocket, secured by blockchain, powered by AI.

**[End screen with team names and app information]**

---

## VISUAL CHECKLIST FOR VIDEO PRODUCTION

### Slides Needed:
1. ❌ **Slide 1 - Problem Statistics:**
   - Title: "The Physical Therapy Accessibility Crisis"
   - "2 million student athletes injured annually" (NATA source)
   - "Average PT session: $100-$150" (NCHS source)
   - Bar chart showing rising PT costs over past 5 years
   - "60% discontinue PT due to transportation/scheduling" (JPO study)
2. ❌ **Slide 2 - Solution Overview:** Theravive features overview
3. ❌ **Blockchain flowchart** (use BLOCKCHAIN_FLOWCHART_SIMPLE.md)
4. ❌ **Future goals slide** with social proof (TikTok, emails)

### App Screenshots/Recordings Needed:
1. ❌ Login/Signup screens (patient and doctor) - **with "DEMO DATA" overlay for doctor**
2. ❌ Doctor dashboard showing patient requests
3. ❌ Patient workout assignment screen
4. ❌ Camera/recording screen with form analysis
5. ❌ Analysis results screen (scores + feedback)
6. ❌ Blockchain records view
7. ❌ AI chatbot interface
8. ❌ Community feed
9. ❌ Pain tracking log

### Code File Recordings Needed:
1. ❌ `src/config/firebase.js` - Firebase configuration
2. ❌ `src/utils/PoseDetector.js` - Lines 72-80 (calculateAngle function)
3. ❌ `src/screens/AssignedWorkoutTrackingScreen.js` - finishWorkout function
4. ❌ `src/services/BlockchainRecordsService.js` - Key functions
5. ❌ `src/screens/WorkoutAssignmentScreen.js` - Brief overview
6. ❌ `src/components/FloatingChatbot.js` - AI chatbot component
7. ❌ `src/screens/ViewRecordsScreen.js` - Blockchain authentication

### External Content Needed:
1. ❌ TikTok account screenshots (with stock images)
2. ❌ Email screenshots to PT clinics
3. ❌ 8 athlete interview clips (2-3 words each, quick cuts)

---

## SPEAKING NOTES

### Timing Guidelines (Updated):
- **Saketh:** 00:15-01:25 (70 seconds) - Problem/Solution, Login, Firebase Backend, Doctor Connectivity
- **Kavin:** 01:25-02:45 (80 seconds) - Form Tracker, Pose Detection, Code Explanation, Additional Features
- **Safwaan:** 02:05-02:25 & 02:45-03:00 (35 seconds) - Blockchain Security & Future Goals
- **Total:** ~3 minutes

### Key Points to Emphasize:
- **Community Focus:** Use "our community" language throughout
- **Accessibility:** Addresses cost and geographic barriers for student athletes
- **Innovation:** AI pose detection (MediaPipe + arctan) + Blockchain security (AES-256, Ethereum)
- **Technical Depth:** Show specific code files and explain implementation
- **Impact:** Helps student athletes in our community prevent injuries
- **Technology:** Real-time analysis, secure records, doctor connectivity via Firebase
- **Future:** Partnerships, expanded features, greater reach in our community

### Congressional App Challenge Alignment:
✅ Demonstrates app functionality with live app views
✅ Explains problem being solved with statistics and sources
✅ Shows technical implementation (code files, AI MediaPipe, Blockchain)
✅ Discusses impact and future plans
✅ Highlights innovative use of technology (pose detection + blockchain)
✅ Includes real-world application (athletes, PT clinics in community)
✅ Shows full understanding of codebase with specific file references

---

## RECORDING TIPS

1. **Record audio separately** for clarity, then sync with visuals
2. **Use screen recording** for app demonstrations (iOS Screen Recording or QuickTime)
3. **Use code editor** (VS Code/Cursor) for code demonstrations - ensure syntax highlighting is visible
4. **Include smooth transitions** between slides, app views, and code
5. **Maintain consistent lighting** for speaking segments
6. **Keep background minimal** when showing app or speaking
7. **Practice transitions** - app → code → slide → app should be seamless
8. **Zoom in on code** when explaining specific functions (use Cmd/Ctrl + to zoom)
9. **Highlight code sections** when talking about them (select text or use cursor)
10. **End screen should include:**
   - App name: Theravive
   - Team members: Saketh Nandam, Kavin Sandhu, Safwaan Majid
   - Contact/Social: TikTok handle, website (if applicable)

---

## REVISIONS BASED ON RUBRIC

**Note:** If you have specific Congressional App Challenge rubric requirements, please share them and we can adjust:
- Length requirements (if different from 3 minutes)
- Required sections
- Technical depth needed
- Documentation requirements

