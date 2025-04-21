import { Navbar } from './components/navebar';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='min-h-screen flex flex-col'>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
