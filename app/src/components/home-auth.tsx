'use client';

import { decodeJwt } from '@clerk/backend/jwt';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

// Create a component that uses the auth hook
export function HomeContent() {
  const { getToken } = useAuth();
  const [authData, setAuthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getToken();
        
        if (!token) {
          setAuthData({ error: 'No token found' });
          return;
        }

        const response = await fetch('/api/private', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const data = await response.json();
        setAuthData(data);
      } catch (error) {
        console.error('Authentication error:', error);
        setAuthData({ error: 'Failed to authenticate' });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [getToken]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <p>YOU ARE: {JSON.stringify(authData)}</p>
    </div>
  );
}