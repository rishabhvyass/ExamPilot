# Firebase setup (one-time, in the Firebase console)

1. **Create a project** at https://console.firebase.google.com (Spark/free plan is fine).
2. **Add an iOS app** with bundle ID `com.exampilot` → download `GoogleService-Info.plist`.
3. **Add an Android app** with package `com.exampilot` → download `google-services.json`.
   (For Google sign-in on Android you'll also need the debug SHA-1: `cd android && ./gradlew signingReport`.)
4. **Authentication → Sign-in method**: enable **Email/Password** and **Google**.
   Copy the Google provider's *Web client ID* (Web SDK configuration) into `src/config/firebase.ts`.
5. **Firestore Database → Create database** (production mode, a region near your students, e.g. `asia-south1`).
   Then **Rules** → paste `firestore.rules` from this folder → Publish.
6. Put the files here:
   - `mobile/ios/ExamPilot/GoogleService-Info.plist`
   - `mobile/android/app/google-services.json`

The app adds the plist to the Xcode target and registers the Google URL scheme
(`REVERSED_CLIENT_ID`) in `Info.plist`.

## How data flows
- Signed out: data lives on the device (AsyncStorage `exampilot:v1`).
- First sign-in for an account: local data is copied up once to `users/{uid}`.
- Signed in: every change is diffed and written to Firestore (~400 ms debounce); offline writes queue.
- Sign out: the device resets to fresh sample data; the account's data stays in Firestore.
