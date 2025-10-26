# Setup Guide for Developers

## 🔐 Security & Environment Variables

This project uses environment variables to protect sensitive API keys. Follow these steps to set up your local development environment:

### Quick Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys to `.env`:**
   - Your `.env` file is automatically ignored by Git (see `.gitignore`)
   - Never commit this file to version control
   - Each developer needs their own `.env` file with their keys

### Required API Keys

#### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Navigate to: **Project Settings** → **General**
4. Scroll to "Your apps" section
5. Copy all the config values to your `.env` file

#### Gemini AI API Key
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy the key to `GEMINI_API_KEY` in `.env`

#### Llama Vision API (Optional)
- Only needed if using Llama Vision features
- Get your key from your Llama API provider
- Add to `.env` file

### Verification

After setting up your `.env` file, verify it's working:

```bash
# Start the app
npm start

# Check that Firebase connects properly
# Check that AI features work
```

### Important Notes

✅ **DO:**
- Keep your `.env` file private
- Use `.env.example` as a reference
- Update `.env.example` if you add new variables (without real values)
- Share this guide with new developers

❌ **DON'T:**
- Commit `.env` to Git
- Share your API keys publicly
- Hard-code API keys in source files
- Include keys in screenshots or documentation

### Troubleshooting

**"Cannot find module '@env'"**
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Restart Metro bundler

**"Firebase: Error (auth/invalid-api-key)"**
- Check that your Firebase API key is correct in `.env`
- Make sure there are no extra spaces or quotes
- Verify your Firebase project is active

**Environment variables not updating:**
- Stop the dev server completely
- Clear Expo cache: `expo start -c`
- Restart the server

## 🚀 Pushing to GitHub

When pushing your code, follow these steps:

### First Time Setup

1. **Verify `.env` is ignored:**
   ```bash
   git status
   ```
   You should see `.env.example` but NOT `.env`

2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Stage your changes:**
   ```bash
   git add .
   ```

4. **Commit your changes:**
   ```bash
   git commit -m "Add: description of your changes"
   ```

5. **Push to GitHub:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Pre-Push Checklist

Before pushing, always verify:

- [ ] `.env` is NOT in staged files (`git status`)
- [ ] All API keys are removed from source code
- [ ] `.env.example` is up to date
- [ ] README.md has setup instructions
- [ ] Code works with environment variables
- [ ] No console.logs with sensitive data

### Files That Should Be Committed

✅ These are safe to commit:
- `.env.example` - Template with placeholder values
- `.gitignore` - Contains `.env` exclusion
- `src/config/firebase.js` - Uses `@env` imports
- `babel.config.js` - Configures `react-native-dotenv`
- All source code files (without hardcoded keys)

❌ These should NEVER be committed:
- `.env` - Contains your actual API keys
- Any file with hardcoded API keys
- `node_modules/`
- `.expo/`

## 🔄 For New Team Members

When someone clones the repository:

1. They'll get `.env.example` but not `.env`
2. They copy `.env.example` to `.env`
3. They add their own API keys
4. The app works without seeing your keys!

This way, the code is public but the keys stay private. 🎉

