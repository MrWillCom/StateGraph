import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import os from 'os';
import './App.scss';
import styles from './App.module.scss';
import BarState from './components/BarState';
import Win32WindowControls from './components/Win32WindowControls';

class Home extends React.Component<
  unknown,
  {
    ram: { used: number; total: number };
    cpu: { model: string; used: number; total: number };
  }
> {
  ramInterval: NodeJS.Timer | number;

  cpuInterval: NodeJS.Timer | number;

  constructor(props: unknown) {
    super(props);

    this.state = {
      ram: {
        used: 0,
        total: 1,
      },
      cpu: {
        model: 'Unknown',
        used: 0,
        total: 1,
      },
    };

    this.ramInterval = 0;
    this.cpuInterval = 0;
  }

  componentDidMount() {
    this.ramInterval = setInterval(this.updateRAM.bind(this), 1000);
    this.cpuInterval = setInterval(this.updateCPU.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.ramInterval);
    clearInterval(this.cpuInterval);
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

  updateCPU() {
    const cpus = os.cpus();

    let idle = 0;
    let total = 0;
    // 'models' is reassigned later, don't use 'const'
    // eslint-disable-next-line prefer-const
    let models: Array<string> = [];

    for (let i = 0, len = cpus.length; i < len; i++) {
      const cpu = cpus[i];

      total +=
        cpu.times.user +
        cpu.times.nice +
        cpu.times.sys +
        cpu.times.idle +
        cpu.times.irq;
      idle += cpu.times.idle;

      if (
        !models.find((val) => {
          return val === cpu.model;
        })
      ) {
        models.push(cpu.model);
      }
    }

    this.setState({
      cpu: {
        model: (() => {
          let modelsStr = '';

          for (let i = 0; i < models.length; i++) {
            modelsStr += models[i];
            if (i < models.length - 1) {
              modelsStr += ' & ';
            }
          }

          return modelsStr;
        })(),
        used: total - idle,
        total,
      },
    });
  }

  render() {
    const { cpu, ram } = this.state;
    return (
      <>
        {navigator.platform === 'Win32' ? <Win32WindowControls /> : <></>}
        <div className={styles.container}>
          <BarState
            title="CPU"
            description="Average since startup"
            value={cpu.used}
            total={cpu.total}
            details={`${Math.round((cpu.used / cpu.total) * 100)}%`}
          />
          <BarState
            title="RAM"
            value={ram.used}
            total={ram.total}
            details={`${ram.used} / ${ram.total} GB`}
          />
        </div>
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
