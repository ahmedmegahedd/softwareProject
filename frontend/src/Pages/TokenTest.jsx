import React, { useEffect } from 'react';

export default function TokenTest() {
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/users/profile', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => console.log('[TokenTest] Profile:', data));
  }, []);
  return <div>Check console for token and profile fetch</div>;
} 