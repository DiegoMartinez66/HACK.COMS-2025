import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MatchCodeRoute from './routes/MatchCodeRoute';
import LoginRoute from './routes/LoginRoute';
import QuizRoute from './routes/QuizRoute';

function App() {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<MatchCodeRoute />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path='/quiz' element={<QuizRoute />} />
      </Routes>
    </Router>
  );
}

export default App;