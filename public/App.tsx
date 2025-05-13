import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPage from './profile/page';
const App: React.FC = () => {
  return (
    <body>  
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/profile" element={<UserPage />} />
        </Routes>
      </Router> 
    </body>

  );
};

export default App;