import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPage from './[userId]/page';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:userId" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;