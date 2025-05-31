# Database Client Module

This module provides a seamless integration between Clerk authentication and Supabase database access.

## Overview

The database client module offers three ways to interact with your Supabase database:

1. **Standard client** - For unauthenticated requests or server-side operations
2. **Token-based client** - For server components with manual token handling
3. **React hook** - For client components with automatic authentication

## Prerequisites

- Supabase project with URL and anon key in environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_KEY`
- Clerk authentication with a JWT template named 'supabase'

## Usage Examples

### 1. Standard Supabase Client

Use this for public data or server-side operations that don't require user authentication.

```typescript
// In a server component or API route:
import { supabase } from '@/app/lib/db'

async function getData() {
  // Use the standard Supabase client for public data
  const { data } = await supabase.from('public_table').select('*')
  return data
}
```

### 2. Server-Side with Authentication

Use this in server components or API routes where you need user authentication.

```typescript
// In a server component or API route:
import { createClerkSupabaseClient } from '@/app/lib/db'
import { auth } from '@clerk/nextjs'

async function getProtectedData() {
  // Get the token from Clerk
  const { getToken } = auth()
  const token = await getToken({ template: 'supabase' })
  
  // Create an authenticated client
  const supabase = createClerkSupabaseClient(token)
  
  // Use the client to access protected resources
  const { data } = await supabase.from('protected_table').select('*')
  return data
}
```

### 3. Client-Side with Authentication

Use this in client components where you need user authentication.

```typescript
// In a client component:
'use client'

import { useSupabase } from '@/app/lib/db'
import { useState, useEffect } from 'react'

export default function ProfileComponent() {
  const supabase = useSupabase()
  const [profile, setProfile] = useState(null)
  
  useEffect(() => {
    async function fetchProfile() {
      // Use the authenticated client to fetch user-specific data
      const { data } = await supabase.from('profiles').select('*').single()
      setProfile(data)
    }
    
    fetchProfile()
  }, [supabase])
  
  return <div>{profile ? JSON.stringify(profile) : 'Loading...'}</div>
}
```

## How It Works

1. **Authentication Flow**:
   - Clerk provides JWT tokens that are compatible with Supabase
   - The tokens are injected into the Authorization header of Supabase requests
   - Supabase RLS (Row Level Security) policies can use the JWT claims

2. **Token Template**:
   - The module uses a Clerk JWT template named 'supabase'
   - This template should be configured in your Clerk dashboard

3. **Client Creation**:
   - Each client uses a custom fetch implementation
   - The fetch function injects the authentication token into requests
   - This happens transparently for the developer

## Best Practices

- Use the standard client for public data
- Use the authenticated clients for user-specific data
- Set up proper RLS policies in Supabase
- Keep your environment variables secure