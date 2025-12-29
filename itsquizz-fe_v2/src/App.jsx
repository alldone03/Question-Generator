import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/web';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-base-200">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
