import styles from './BarState.module.scss';

type BarStateOptions = {
  title?: string;
  value: number;
  total: number;
  details?: string;
};

const BarState = (props: BarStateOptions) => {
  const { title, value, total, details } = props;
  return (
    <div className={styles.container}>
      <div className={styles.trailing}>
        <div className={styles.title}>{title || ''}</div>
        <div className={styles.details}>{details || `${value} / ${total}`}</div>
      </div>
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={{ '--value': value, '--total': total }}
        />
      </div>
    </div>
  );
};

export default BarState;
