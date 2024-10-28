import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import StudentManagement from './Component/ManageStudent';
import StudentDetail from './Component/Studentdetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentManagement />} />
        <Route path="/student/:id" element={<StudentDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
