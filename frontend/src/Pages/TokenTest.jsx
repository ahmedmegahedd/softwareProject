import React, { useEffect } from 'react';

export default function TokenTest() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('[TokenTest] Token:', token);
    fetch('http://localhost:5000/api/v1/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => console.log('[TokenTest] Profile:', data));
  }, []);
  return <div>Check console for token and profile fetch</div>;
} 