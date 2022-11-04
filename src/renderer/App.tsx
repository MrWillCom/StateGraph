import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import os from 'os';
import './App.scss';
import BarState from './components/BarState';
import Win32WindowControls from './components/Win32WindowControls';

class Home extends React.Component<
  {},
  { ram: { used: number; total: number } }
> {
  constructor(props) {
    super(props);

    this.state = {
      ram: {
        used: 0,
        total: 1,
      },
    };

    this.ramInterval = 0;
  }

  componentDidMount() {
    this.ramInterval = setInterval(this.updateRAM.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.ramInterval);
  }

  updateRAM() {
    this.setState({
      ram: {
        used:
          Math.round(
            ((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024) * 100
          ) / 100,
        total: Math.round((os.totalmem() / 1024 / 1024 / 1024) * 100) / 100,
      },
    });
  }

  render() {
    return (
      <>
        {navigator.platform === 'Win32' ? <Win32WindowControls /> : <></>}
        <BarState
          title="RAM"
          value={this.state.ram.used}
          total={this.state.ram.total}
          details={`${this.state.ram.used} / ${this.state.ram.total} GB`}
        />
      </>
    );
  }
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
