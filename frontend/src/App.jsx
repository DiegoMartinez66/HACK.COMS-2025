import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginRoute from './routes/LoginRoute';
import QuizRoute from './routes/QuizRoute';
import LandingRoute from './routes/LandingRoute';
import CreateRoute from './routes/CreateRoute';
import JoinRoute from './routes/JoinRoute';

function App() {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingRoute />} />        
        <Route path='/create' element={<CreateRoute />}/>
        <Route path='/join' element={<JoinRoute />}/>
        <Route path="/login" element={<LoginRoute />} />
        <Route path='/quiz' element={<QuizRoute />} />
      </Routes>
    </Router>
  );
}

export default App;