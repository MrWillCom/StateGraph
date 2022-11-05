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
    cpuModel: string;
    cpu: { used: number; total: number };
  }
> {
  ramInterval: NodeJS.Timer | number;

  cpuInterval: NodeJS.Timer | number;

  cpuState: {
    previous: {
      idle: number;
      total: number;
    };
    now: {
      idle: number;
      total: number;
    };
  };

  constructor(props: unknown) {
    super(props);

    this.state = {
      ram: {
        used: 0,
        total: 1,
      },
      cpuModel: (() => {
        const cpus = os.cpus();

        const models: Array<string> = [];

        for (let i = 0, len = cpus.length; i < len; i++) {
          if (
            !models.find((val) => {
              return val === cpus[i].model;
            })
          ) {
            models.push(cpus[i].model);
          }
        }

        let modelsStr = '';

        for (let i = 0; i < models.length; i++) {
          modelsStr += models[i];
          if (i < models.length - 1) {
            modelsStr += ' & ';
          }
        }

        return modelsStr;
      })(),
      cpu: {
        used: 0,
        total: 1,
      },
    };

    this.ramInterval = 0;
    this.cpuInterval = 0;

    this.cpuState = {
      previous: this.getCPUState(),
      now: this.getCPUState(),
    };
  }

  componentDidMount() {
    this.ramInterval = setInterval(this.updateRAM.bind(this), 1000);
    this.cpuInterval = setInterval(this.updateCPU.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.ramInterval);
    clearInterval(this.cpuInterval);
  }

  getCPUState = () => {
    const cpus = os.cpus();

    let idle = 0;
    let total = 0;

    for (let i = 0, len = cpus.length; i < len; i++) {
      const cpu = cpus[i];

      total +=
        cpu.times.user +
        cpu.times.nice +
        cpu.times.sys +
        cpu.times.idle +
        cpu.times.irq;
      idle += cpu.times.idle;
    }

    return { idle, total };
  };

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
    this.cpuState.previous = this.cpuState.now;
    this.cpuState.now = this.getCPUState();

    const total = this.cpuState.now.total - this.cpuState.previous.total;
    const used = total - (this.cpuState.now.idle - this.cpuState.previous.idle);

    this.setState({
      cpu: { used, total },
    });
  }

  render() {
    const { cpuModel, cpu, ram } = this.state;
    return (
      <>
        {navigator.platform === 'Win32' ? <Win32WindowControls /> : <></>}
        <div className={styles.container}>
          <BarState
            title="CPU"
            description={cpuModel}
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
