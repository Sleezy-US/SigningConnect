import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AgentDashboard from './AgentDashboard';
import CompanyDashboard from './CompanyDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Agent portal */}
        <Route path="/agent" element={<AgentDashboard />} />
        
        {/* Company portal */}
        <Route path="/company" element={<CompanyDashboard />} />
        
        {/* Default redirect to agent dashboard */}
        <Route path="/" element={<Navigate to="/agent" replace />} />
        
        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/agent" replace />} />
      </Routes>
    </Router>
  );
}

export default App;