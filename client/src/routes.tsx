// routes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { About } from './components/About'; 

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/ngo-dashboard" element={<About />} />
    </Routes>
  );
};

export default AppRoutes;