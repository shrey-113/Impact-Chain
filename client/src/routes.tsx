// routes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { NgoDashboard } from './components/NgoDashboard'; 
import NgoLayout from './components/NgoLayout'
import { AllCauses } from './components/AllCauses';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="ngo" element={<NgoLayout />}>
          <Route index element={<NgoDashboard/>} />
          <Route path="allcauses" element={<AllCauses/>} />
          <Route path="profile" element={<AllCauses/>} />
          <Route path="mycauses" element={<AllCauses/>} />

        </Route>
    </Routes>
  );
};

export default AppRoutes;