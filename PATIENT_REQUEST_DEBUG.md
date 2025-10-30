# Patient Request Debugging Guide

## Issue
Doctors are not receiving patient requests when patients sign up with their email.

## Changes Made

### 1. Added Comprehensive Logging

#### SignUpScreen.js
- Logs when a doctor is found by email
- Logs the doctor's ID and data
- Logs when creating a patient request
- Logs the patient request data
- Logs the created request ID

#### DoctorDashboardScreen.js
- Logs when fetching patient requests
- Logs the doctor's UID being queried
- Logs the number of requests found
- Logs each individual request

#### DoctorInboxScreen.js
- Logs when fetching patient requests
- Logs the doctor's UID being queried
- Logs the number of requests found
- Logs each individual request

## How to Test

### Step 1: Create a Doctor Account
1. Run the app
2. Sign up as a Doctor
3. Email: `doctor@test.com`
4. Fill in all required fields
5. Complete the survey
6. **Note the doctor's UID from console logs**

### Step 2: Create a Patient Account
1. Log out
2. Sign up as a Patient
3. Enter the doctor's email: `doctor@test.com`
4. Complete signup

### Step 3: Check Console Logs

Look for these logs in the terminal/console:

**During Patient Signup:**
```
Found doctor with ID: [doctor_uid_here]
Doctor data: { ... }
Creating patient request for doctorId: [doctor_uid_here]
Patient request data: { patientId, patientName, doctorId, ... }
Patient request created with ID: [request_id_here]
```

**When Doctor Logs In:**
```
Fetching patient requests for doctor ID: [doctor_uid_here]
Found [number] pending patient requests
Patient request: { ... }
```

## Common Issues & Fixes

### Issue 1: Doctor Not Found
**Symptom:** Alert: "No doctor found with that email address"
**Cause:** Doctor email doesn't exist or doctor hasn't completed signup
**Fix:** 
1. Verify doctor account exists in Firebase Console → Authentication
2. Check Firestore → users collection → find doctor document
3. Verify `userType: 'doctor'` in the document

### Issue 2: Request Created But Not Showing
**Symptom:** "Patient request created with ID" logged, but doctor doesn't see it
**Possible Causes:**

#### A. UID Mismatch
- Check if doctor's UID in console logs matches
- Compare: "Found doctor with ID: X" vs "Fetching patient requests for doctor ID: Y"
- If they don't match, there's a UID synchronization issue

#### B. Missing Firestore Index
- Error in console: "The query requires an index"
- Go to Firebase Console → Firestore Database → Indexes
- Click the link in the error message to create the index automatically

#### C. Firestore Security Rules
- Check Firebase Console → Firestore Database → Rules
- Ensure rules allow authenticated users to read patientRequests

### Issue 3: No Logs Appearing
**Symptom:** Console is silent
**Fix:**
1. Clear app cache and restart
2. Ensure you're watching the correct terminal/console
3. Run: `npx expo start --clear`

## Manual Verification in Firebase Console

### 1. Check Authentication
- Go to Firebase Console → Authentication → Users
- Verify both doctor and patient accounts exist
- Note their UIDs

### 2. Check Firestore - Users Collection
- Go to Firestore Database → users collection
- Find the doctor document (use UID from Authentication)
- Verify:
  - `userType: "doctor"`
  - `email` matches what patient entered

### 3. Check Firestore - patientRequests Collection
- Go to Firestore Database → patientRequests collection
- Look for the patient's request
- Verify:
  - `doctorId` matches the doctor's UID
  - `status: "pending"`
  - `patientName`, `patientEmail` are correct

### 4. Check Firestore Security Rules
Current rules should look like:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Expected Data Flow

1. **Patient Signs Up**
   - Enters doctor's email: `doctor@test.com`
   - System queries `users` collection for doctor with that email
   - Gets doctor's document ID (which is their UID)
   - Creates patient account
   - Creates document in `patientRequests` with `doctorId: [doctor_uid]`

2. **Doctor Logs In**
   - System loads doctor's `userProfile` with `userProfile.uid`
   - Queries `patientRequests` where `doctorId == userProfile.uid`
   - Should find the pending request from Step 1

## Debug Checklist

- [ ] Doctor account created successfully
- [ ] Doctor's email is correct in Firestore
- [ ] Patient signup found the doctor (check console logs)
- [ ] Patient request created (check console logs + Firestore)
- [ ] Doctor's UID matches in both places
- [ ] Firestore rules allow reading patientRequests
- [ ] Required indexes are created
- [ ] No errors in console

## If Still Not Working

Share these console logs:
1. The output when patient signs up (includes doctor ID)
2. The output when doctor logs in (includes query results)
3. Screenshot of Firestore patientRequests collection
4. Screenshot of the doctor's user document in Firestore

