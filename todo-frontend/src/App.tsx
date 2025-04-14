import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from './services/ApplicationInsightsService';
import { NavBar } from './components/NavBar'
import { About } from './pages/About'
import { TodoPage } from './pages/TodoPage'

function App() {
  return (
    <Router>
      <AppInsightsContext.Provider value={reactPlugin}>
        <NavBar />
        <Routes>
          <Route path="/" element={<TodoPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AppInsightsContext.Provider>
    </Router>
  );
}

export default App
