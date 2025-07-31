'use client';

import { useEffect, useState } from 'react';

const valuePropositions = [
  { text: 'Discreet shipping', color: 'text-blue-400' },
  { text: 'Affordable pleasure', color: 'text-pink-500' },
  { text: 'Sexual Health Tips', color: 'text-purple-400' },
  { text: 'Lingerie', color: 'text-red-400' },
];

export function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % valuePropositions.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentProp = valuePropositions[currentIndex];

  return (
    <span className={`inline-block ${currentProp.color} font-bold`}>
      {currentProp.text}
    </span>
  );
}
