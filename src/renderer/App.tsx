import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.scss';
import Win32WindowControls from './components/Win32WindowControls';

const Home = () => {
  return (
    <>{navigator.platform === 'Win32' ? <Win32WindowControls /> : <></>}</>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
