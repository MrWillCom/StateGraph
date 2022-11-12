import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './BarState.module.scss';

const HISTORY_LENGTH = 60;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type BarStateProps = {
  title?: string;
  description?: string;
  value: number;
  total: number;
  details?: string;
};

type BarStateState = {
  history: Array<number>;
};

class BarState extends React.Component<BarStateProps, BarStateState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    title: '',
    description: '',
    details: false,
  };

  constructor(props: BarStateProps) {
    super(props);

    this.state = {
      history: [],
    };
  }

  componentDidUpdate(_prevProps: BarStateProps, prevState: BarStateState) {
    const { value, total } = this.props;
    const { history } = this.state;
    if (prevState.history.length >= HISTORY_LENGTH) {
      prevState.history.shift();
    }
    prevState.history.push(value / total);
    if (JSON.stringify(prevState.history) !== JSON.stringify(history)) {
      this.setState({ history: prevState.history });
    }
  }

  render() {
    const { title, description, value, total, details } = this.props;
    const { history } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.trailing}>
          <div className={styles.leftSide}>
            <div className={styles.title}>{title}</div>
            <div className={styles.description}>{description}</div>
          </div>
          <div className={styles.details}>
            {details || `${value} / ${total}`}
          </div>
        </div>
        <div className={styles.bar}>
          <div
            className={styles.fill}
            style={
              { '--value': value, '--total': total } as React.CSSProperties
            }
          />
        </div>
        <Line
          options={{
            elements: {
              point: {
                radius: 0,
              },
            },
            scales: {
              x: {
                display: false,
              },
              y: {
                display: false,
                min: 0,
                max: 1,
              },
            },
            animation: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
          }}
          data={{
            labels: (() => {
              const labels = [];
              for (let i = 0; i < HISTORY_LENGTH; i++) {
                labels.push((i - HISTORY_LENGTH + 1).toString(10));
              }
              return labels;
            })(),
            datasets: [
              {
                data: history,
                borderColor: window.matchMedia('(prefers-color-scheme: dark)')
                  .matches
                  ? '#4cc2ffb0'
                  : '#0067c0b0',
                borderWidth: 2,
              },
            ],
          }}
          className={styles.chart}
        />
      </div>
    );
  }
}

export default BarState;
