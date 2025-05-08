import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Weather from './components/Weather';
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Weather />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
