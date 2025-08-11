# 🎯 App Name Configuration Guide

This project uses a centralized configuration system to manage the app name across all components. You can change the app name in **one place** and it will reflect everywhere.

## 📍 Where to Change the App Name

### For Frontend (React)
**File**: `frontend/src/config/appConfig.ts`
```typescript
export const APP_CONFIG = {
  name: 'YourNewAppName',           // ← Change this
  displayName: 'Your New App Name', // ← And this
  tagline: 'Your app tagline',      // ← And this
  // ... rest of config
}
```

### For Backend (Go)
**File**: `backend/config.go`
```go
var APP_CONFIG = AppConfig{
    Name:         "YourNewAppName",        // ← Change this
    DisplayName:  "Your New App Name",    // ← And this
    DatabaseName: "yournewappname",       // ← And this (lowercase)
    APIMessage:   "Your New App Name API is running",
}
```

### For Docker & Database Names
**File**: `.app.env`
```env
APP_NAME=yournewappname              # ← Change this (lowercase, no spaces)
APP_DISPLAY_NAME=Your New App Name   # ← And this
```

## 🔄 What Gets Updated Automatically

When you change the app name in the config files above, it will automatically update:

### Frontend
- ✅ **Navigation bar title** (LandingPage)
- ✅ **Login page subtitle** ("Sign in to your [AppName] account")
- ✅ **Signup page title** ("Join [AppName]")
- ✅ **Dashboard header** (BrandDashboard)
- ✅ **Browser tab title** (index.html)
- ✅ **Package.json name**

### Backend
- ✅ **Server startup message** ("[AppName] backend server starting...")
- ✅ **API health check message** ("[AppName] API is running")
- ✅ **Database collection names**

### Docker & Infrastructure
- ✅ **Container names** (when using .app.env)
- ✅ **Database names**
- ✅ **Network names**

## 🚀 Quick Change Example

To change from "SponsorConnect" to "BrandBridge":

1. **Frontend**: Update `frontend/src/config/appConfig.ts`
   ```typescript
   name: 'BrandBridge',
   displayName: 'BrandBridge', 
   ```

2. **Backend**: Update `backend/config.go`
   ```go
   Name: "BrandBridge",
   DisplayName: "BrandBridge",
   DatabaseName: "brandbridge",
   ```

3. **Infrastructure**: Update `.app.env`
   ```env
   APP_NAME=brandbridge
   APP_DISPLAY_NAME=BrandBridge
   ```

That's it! The app name will be updated everywhere. ✨

## 📝 Notes

- Use **lowercase, no spaces** for database and container names
- Use **proper case** for display names shown to users  
- The system is designed to be easily rebrandable
- Always restart servers after config changes
