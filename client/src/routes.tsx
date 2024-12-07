import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import NgoLayout from './components/NgoLayout';
import { AllCauses } from './components/AllCauses';
import { CauseDetail } from './components/CauseDetail';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="ngo" element={<NgoLayout />}>
        <Route index element={<AllCauses />} />
        <Route path="allcauses" element={<AllCauses />} />
        <Route path="profile" element={<AllCauses />} />
        <Route path="mycauses" element={<AllCauses />} />
        <Route path="cause/:id" element={<CauseDetail />} /> {/* New route for cause details */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;