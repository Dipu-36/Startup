# GitHub Copilot Instructions for Vouch Project

## Project Overview
Vouch is a full-stack influencer marketing platform connecting brands with content creators. Built with React (TypeScript), Go backend, MongoDB, and Clerk authentication.

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router v6
- **Backend**: Go (Golang), Gorilla Mux, MongoDB Driver
- **Database**: MongoDB (users, campaigns, applications collections)
- **Authentication**: Clerk (JWT tokens, clerkId-based user identification)
- **Styling**: Tailwind CSS with custom color variables

## Project Structure
```
frontend/
  src/
    components/
      brand/ - Brand dashboard, campaigns, applications
      creator/ - Creator dashboard, browse campaigns
      shared/ - Reusable UI components
    services/ - API service layers
    contexts/ - React contexts (AuthContext)
backend/
  main.go - Server setup, routes
  handlers.go - API endpoint handlers
  auth.go - Authentication middleware
  models.go - Data models
  database.go - MongoDB connection
```

## Key Conventions

### Authentication & User Management
- Always use `clerkId` (not MongoDB `_id`) for user identification in campaigns/applications
- Get authenticated user: `const { user, getToken } = useAuth()`
- API calls require: `Authorization: Bearer ${token}` header
- User types: `brand` or `influencer` (stored in database users collection)

### API Endpoints Pattern
```
GET    /api/campaigns          - Get all campaigns (brand: owned, creator: available)
POST   /api/campaigns          - Create campaign (brand only)
GET    /api/campaigns/:id      - Get single campaign
PUT    /api/campaigns/:id      - Update campaign (brand only)
DELETE /api/campaigns/:id      - Delete campaign (brand only)

GET    /api/applications       - Get applications (brand: for their campaigns, creator: their applications)
POST   /api/applications       - Apply to campaign (creator only)
PUT    /api/applications/:id/status - Update application status (brand only)
```

### Data Models

#### Campaign
```typescript
{
  id: string,
  brandId: string,        // clerkId of brand user
  brandName: string,
  title: string,
  description: string,
  category: string,
  startDate: string,
  endDate: string,
  campaignType: string,
  targetAudience: {
    location: string,
    ageGroup: string,
    gender: string,
    interests: string
  },
  platforms: string[],
  minRequirements: {
    followersCount: string,
    engagementRate: string,
    contentStyle: string,
    languages: string[]
  },
  contentFormat: string[],
  numberOfPosts: string,
  compensationType: string,
  paymentAmount: string,
  status: 'active' | 'draft' | 'closed'
}
```

#### Application
```typescript
{
  id: string,
  campaignId: string,
  creatorId: string,      // clerkId of creator
  creatorName: string,
  creatorEmail: string,
  followers: string,
  platform: string,
  status: 'pending' | 'approved' | 'rejected',
  appliedDate: string,
  campaignName: string
}
```

### Component Patterns

#### Fetching Data
```typescript
useEffect(() => {
  const fetchData = async () => {
    const token = await getToken();
    if (!token) return;
    
    const response = await fetch('http://localhost:8080/api/endpoint', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      setData(data);
    }
  };
  
  fetchData();
}, [getToken]);
```

#### Creating/Updating Data
```typescript
const handleSubmit = async () => {
  const token = await getToken();
  const response = await fetch('http://localhost:8080/api/endpoint', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (response.ok) {
    // Success handling
  }
};
```

### UI/UX Guidelines
- Use Tailwind utility classes for styling
- Responsive: mobile-first approach with `sm:`, `md:`, `lg:` breakpoints
- Color scheme: Primary (blue), Secondary, Accent
- Loading states: Show skeleton loaders or spinners
- Error handling: Display user-friendly error messages
- Animations: Use Tailwind transitions, `animate-pulse`, `animate-fadeIn`

### Form Handling
- Use dropdown selects for predefined options (locations, age groups, followers, etc.)
- Required fields marked with `*`
- Auto-save drafts to localStorage every 30 seconds
- Validate data before submission
- Show loading overlays during async operations

### Backend Patterns

#### Handler Structure
```go
func handlerName(w http.ResponseWriter, r *http.Request) {
  // Get authenticated user
  user, ok := getUserFromContext(r.Context())
  if !ok {
    http.Error(w, "Unauthorized", http.StatusUnauthorized)
    return
  }
  
  userID := getUserIDFromClerkUser(user)
  
  // Database operations
  collection := database.Collection("collection_name")
  // ... logic
  
  w.Header().Set("Content-Type", "application/json")
  json.NewEncoder(w).Encode(response)
}
```

#### Database Queries
```go
// Find documents
filter := bson.M{"brandId": userID}
cursor, err := collection.Find(ctx, filter)

// Insert document
result, err := collection.InsertOne(ctx, document)

// Update document
update := bson.M{"$set": bson.M{"field": value}}
result, err := collection.UpdateOne(ctx, filter, update)

// Delete document
result, err := collection.DeleteOne(ctx, filter)
```

## Common Tasks

### Adding a New API Endpoint
1. Define route in `main.go`: `api.HandleFunc("/api/path", authMiddleware(handler)).Methods("GET")`
2. Create handler in `handlers.go` with proper authentication/authorization checks
3. Verify user ownership for protected resources (use `brandId` or `creatorId` from Clerk)
4. Create/update model in `models.go`
5. Create service function in frontend `services/`
6. Call from component with proper error handling

### Creating a New Page
1. Create component in appropriate folder (`brand/` or `creator/`)
2. Add route in `App.tsx`
3. Wrap with `ProtectedRoute` if authentication required
4. Add navigation links in navbar components

### Debugging
- Backend: Check terminal for Go server logs
- Frontend: Check browser console for errors
- Network: Use browser DevTools Network tab
- Database: Use debug endpoints like `/api/debug/users`, `/api/debug/campaigns`

## Code Quality Standards
- TypeScript: Use proper types, avoid `any`
- Error Handling: Always handle errors gracefully
- Loading States: Show feedback for async operations
- Responsive Design: Test on mobile, tablet, desktop
- Accessibility: Use semantic HTML, ARIA labels
- Comments: Document complex logic only
- Naming: camelCase for variables/functions, PascalCase for components

## Testing Approach
- Manual testing in development
- Test authentication flows with different user types
- Verify CRUD operations work correctly
- Check responsive design on multiple screen sizes
- Validate form inputs and error messages

## Current Focus Areas
1. Brand Dashboard - Full campaign management (CRUD operations), application review
2. Creator Dashboard - Browse campaigns, submit applications
3. Real-time data synchronization with MongoDB
4. Status updates and notifications
5. Filtering and search functionality
6. Campaign analytics and statistics from database

## Recent Updates
- ManageCampaign page now shows real-time statistics from database (applications count, approved creators count, deliverables count, total budget)
- Campaign update/delete endpoints implemented with proper ownership verification
- All campaign CRUD operations fully functional with authentication
