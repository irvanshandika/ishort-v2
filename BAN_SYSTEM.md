# Ban System Implementation

This document outlines the comprehensive ban system implemented for the iShort URL shortener application.

## Overview

The ban system prevents banned users from accessing the application and redirects them to an informative banned page. It checks two types of bans:

1. **Permanent bans**: Stored in the `restrict_account` collection
2. **Temporary bans**: Stored in the `users` collection with `status: "banned"`

## Components

### 1. Ban Utility Functions (`src/lib/banUtils.ts`)

- `checkUserBanStatus(uid: string)`: Comprehensive ban check returning detailed ban information
- `isUserBanned(uid: string)`: Simple boolean ban check

### 2. BanCheck Component (`src/components/BanCheck.tsx`)

- Global component wrapped around the entire application
- Automatically checks user ban status on route changes
- Redirects banned users to `/banned`
- Exempts certain pages from ban checking (login, signup, etc.)

### 3. Banned Page (`app/banned/page.tsx`)

- Displays detailed ban information
- Shows ban type (permanent/temporary)
- Displays ban reason, date, and expiry
- Provides contact information for appeals
- Handles expired temporary bans

### 4. Authentication Integration

- **Signin process**: Checks ban status after successful authentication
- **URL access**: Prevents banned users from accessing shortened URLs
- **Dashboard access**: Protected through BanCheck component

### 5. Custom Hook (`src/hooks/useBanCheck.ts`)

- `useBanCheck()`: Hook for components that need ban checking
- Automatically signs out banned users
- Provides loading states

## How It Works

### 1. Application Layout

```tsx
<BanCheck>
  <App />
</BanCheck>
```

### 2. Ban Detection Flow

1. User authenticates successfully
2. BanCheck component runs
3. Checks `restrict_account` collection for permanent bans
4. Checks `users` collection for temporary bans
5. If banned, redirects to `/banned` page
6. If accessing URLs, prevents access and shows error

### 3. Exempted Pages

The following pages don't require ban checking:

- `/` (homepage)
- `/auth/signin`
- `/auth/signup`
- `/banned`
- `/not-found`
- `/forbidden`

### 4. Database Structure

#### restrict_account Collection

```json
{
  "uid": "user-id",
  "email": "user@example.com",
  "displayName": "User Name",
  "bannedAt": "Timestamp",
  "bannedBy": "admin-id",
  "reason": "Ban reason",
  "permanent": true
}
```

#### users Collection (temporary bans)

```json
{
  "uid": "user-id",
  "status": "banned",
  "bannedReason": "Ban reason",
  "bannedUntil": "Timestamp"
  // ... other user fields
}
```

## Features

### 1. Comprehensive Coverage

- ✅ Global application protection
- ✅ Authentication process protection
- ✅ URL access protection
- ✅ Dashboard protection

### 2. User Experience

- ✅ Clear ban information display
- ✅ Contact information for appeals
- ✅ Different messaging for permanent vs temporary bans
- ✅ Expired ban handling

### 3. Security

- ✅ Immediate logout of banned users
- ✅ Prevention of URL shortening service abuse
- ✅ Graceful error handling
- ✅ Fail-open security (access allowed on errors)

### 4. Admin Features

- ✅ Integration with existing user management system
- ✅ Support for both permanent and temporary bans
- ✅ Detailed ban tracking and logging

## Implementation Details

### 1. Real-time Ban Checking

- Checks occur on every page load for authenticated users
- Efficient database queries using indexed fields
- Caching could be added for high-traffic scenarios

### 2. Error Handling

- Graceful degradation if ban check fails
- Logs errors for debugging
- Fails open (allows access) rather than denying access on errors

### 3. Performance Considerations

- Minimal database calls per session
- Efficient Firestore queries
- Loading states prevent UI flickering

## Usage Examples

### For Components Needing Ban Protection

```tsx
import { useBanCheck } from "@/src/hooks/useBanCheck";

function ProtectedComponent() {
  const { user, loading } = useBanCheck();

  if (loading) return <Loading />;
  if (!user) return <LoginRequired />;

  return <ProtectedContent />;
}
```

### For Manual Ban Checking

```tsx
import { checkUserBanStatus } from "@/src/lib/banUtils";

const banStatus = await checkUserBanStatus(userId);
if (banStatus.isBanned) {
  // Handle banned user
}
```

## Future Enhancements

1. **Appeal System**: Allow users to submit ban appeals
2. **Ban History**: Track ban history for users
3. **IP-based Bans**: Prevent access by IP address
4. **Graduated Penalties**: Automatic temporary bans before permanent bans
5. **Notification System**: Email notifications for bans and appeals

## Testing

To test the ban system:

1. Create a user account
2. Add the user to `restrict_account` collection for permanent ban
3. Or set `status: "banned"` in `users` collection for temporary ban
4. Try to access the application - should redirect to `/banned`
5. Try to access shortened URLs - should show access denied

## Maintenance

Regular maintenance tasks:

1. Clean up expired temporary bans
2. Review ban reasons and patterns
3. Monitor ban appeal requests
4. Update ban policies as needed
