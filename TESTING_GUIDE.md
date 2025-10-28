# Theravive Physical Therapy App - Testing Guide

## 🎯 Completed Features Ready for Testing

### ✅ Authentication System
- **Patient Signup** - Name, Email, Password, Doctor's Email (optional)
- **Doctor Signup** - Name, Email, Password + License Number, State, DOB, Full Name
  - Demo licenses available (see below)
- **Login** - Works for both patients and doctors

### ✅ Demo Doctor Credentials for Testing
Use these to create doctor accounts:

1. **California Doctor**
   - License: `CA12345`
   - State: California
   - Full Name: `John Smith`
   - DOB: `1980-05-15`

2. **New York Doctor**
   - License: `NY67890`
   - State: New York
   - Full Name: `Sarah Johnson`
   - DOB: `1985-11-22`

3. **Texas Doctor**
   - License: `TX54321`
   - State: Texas
   - Full Name: `Michael Chen`
   - DOB: `1978-08-30`

### ✅ Patient Features
1. **Pain Tracking Log**
   - Log pain level (0-10), location, type, notes
   - View pain history and trends
   - Average pain calculation

2. **Injury Timeline**
   - Upload progress pictures
   - View photos grouped by month
   - Timeline view of recovery

3. **Physical Therapy Exercises**
   - 10 PT-specific exercises
   - Browse by category (PT vs Strength Training)
   - View exercise details, tips, and safety info

4. **AI Physical Therapist Chatbot**
   - Three PT specialists (Orthopedic, Sports Rehab, Movement Therapy)
   - Context-aware responses for pain, exercises, mobility, etc.

5. **Community Feed**
   - See public posts from other patients
   - View private posts from your assigned doctor
   - Like and comment on posts

### ✅ Doctor Features
1. **Doctor Dashboard**
   - View all accepted patients
   - See latest form scores
   - Patient statistics

2. **Doctor Inbox**
   - Patient connection requests (accept/reject)
   - Injury picture notifications
   - Filter by status

3. **Workout Assignment**
   - Select exercises from library
   - Add custom instructions per exercise
   - Send to specific patients
   - Creates notification in patient feed

4. **Patient Management**
   - View patient details
   - Access injury timeline
   - Assign workouts with comments

## 📱 Testing Workflow

### Test Scenario 1: Doctor Registration & Patient Connection
1. **Create Doctor Account**
   - Use demo license from above
   - Verify all fields
   - Complete signup

2. **Create Patient Account**
   - Use doctor's email in "Doctor's Email" field
   - Complete signup

3. **Doctor Accepts Patient**
   - Login as doctor
   - Go to Dashboard
   - See pending request notification
   - Accept the patient

4. **Verify Connection**
   - Patient should see doctor status change
   - Doctor sees patient in patient list

### Test Scenario 2: Workout Assignment
1. **Doctor Assigns Workout**
   - Navigate to patient from dashboard
   - Click "Assign Workout"
   - Select 2-3 exercises (mix PT and strength)
   - Add custom instructions (e.g., "3 sets of 10, twice daily")
   - Click Assign

2. **Patient Receives Assignment**
   - Login as patient
   - Check Community feed for private doctor post
   - View workout list (assigned workouts should appear)

### Test Scenario 3: Injury Progress Tracking
1. **Patient Uploads Picture**
   - Go to profile/progress section
   - Upload injury photo
   - Add notes if needed

2. **Doctor Views Progress**
   - Login as doctor
   - See notification in inbox
   - Navigate to patient's Injury Timeline
   - View all photos in chronological order

### Test Scenario 4: Pain Tracking
1. **Log Pain Entry**
   - Open Pain Tracker
   - Select pain level (use slider 0-10)
   - Choose location (or use quick select)
   - Select pain type (Sharp, Dull, etc.)
   - Add notes
   - Save

2. **View Trends**
   - Check average pain level
   - View trend indicator (improving/stable/worsening)
   - Browse pain history

### Test Scenario 5: Community Interaction
1. **Patient Creates Post**
   - Go to Community tab
   - Create new post
   - Share progress update

2. **Doctor Creates Private Post**
   - Login as doctor
   - (Currently done via workout assignment)
   - Patient should see it in their feed

## 🔧 Running the App

```bash
# Install dependencies (if not done)
npm install

# Start the development server
npm start
# or
npx expo start

# Run on device
# - Scan QR code with Expo Go app
# - Or press 'a' for Android, 'i' for iOS
```

## 🐛 Known Limitations

### Features Not Yet Implemented:
1. **MediaPipe Pose Detection** - Camera analysis works, but no real-time pose scoring
2. **Form Score Graph** - Would be empty without MediaPipe scores
3. **Real-time notifications** - Use refresh to see updates

### Workarounds:
- For testing without actual pose detection, form scores can be manually added to Firebase
- Community posts use the existing Firebase structure from HomeScreen

## 📊 Firebase Collections Structure

```
users/
  - userType: 'patient' | 'doctor'
  - doctorId: (for patients)
  - doctorStatus: 'pending' | 'accepted' | 'rejected'
  - patients: [] (for doctors)

patientRequests/
  - patientId
  - doctorId
  - status: 'pending' | 'accepted' | 'rejected'

workoutAssignments/
  - doctorId
  - patientId
  - exercises: [{exerciseId, comment}]
  - assignedAt

painLogs/
  - userId
  - painLevel
  - location
  - painType
  - notes
  - date

injuryPictures/
  - patientId
  - doctorId
  - imageUrl
  - uploadedAt

posts/
  - userId
  - content
  - type
  - visibility: 'public' | 'private'
  - visibleTo: [userId]
```

## 🎨 App Theme

- **Primary Color**: #00d4ff (Cyan)
- **Background**: #1a1a1a (Dark)
- **Cards**: #2d2d2d
- **Text**: White/Light gray

## 📝 Notes for Testing

1. **Email**: Can use any valid email format for testing (doesn't need to be real)
2. **Images**: Required for injury timeline - test with any photos
3. **Refresh**: Pull down on lists to refresh data
4. **Navigation**: Back buttons work throughout
5. **Permissions**: App will request camera/gallery access when uploading photos

## 🚀 Next Steps (Not in Current Build)

1. Integrate actual MediaPipe for pose detection
2. Implement form scoring algorithm
3. Create form score graphs
4. Add real-time notifications
5. Enhance community features

---

**Ready to test!** Start with creating a doctor account using the demo credentials, then a patient account with that doctor's email.

