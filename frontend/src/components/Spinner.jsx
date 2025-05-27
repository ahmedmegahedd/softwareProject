import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/lottie/loading.json';

export default function Spinner() {
  return (
    <div className="flex-center flex-1">
      <div className="w-16 h-16">
        <Lottie animationData={loadingAnimation} loop autoplay style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}