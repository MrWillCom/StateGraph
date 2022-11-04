import React from 'react';
import styles from './Win32WindowControls.module.scss';

const window = require('@electron/remote').getCurrentWindow();

class Win32WindowControls extends React.Component<
  {},
  { windowIsMaximized: boolean }
> {
  constructor(props) {
    super(props);

    this.state = {
      windowIsMaximized: window.isMaximized(),
    };
  }

  componentDidMount() {
    window.on('maximize', this.updateMaximizedState);
    window.on('unmaximize', this.updateMaximizedState);
    // window.on('restore', this.updateMaximizedState);
  }

  componentWillUnmount() {
    window.removeListener('maximize', this.updateMaximizedState);
    window.removeListener('unmaximize', this.updateMaximizedState);
    // window.removeListener('restore', this.updateMaximizedState);
  }

  updateMaximizedState = () => {
    this.setState({
      windowIsMaximized: window.isMaximized(),
    });
  };

  render() {
    return (
      <div className={styles.windowControls}>
        <button
          className={styles.windowMinimize}
          aria-label="Minimize window"
          type="button"
          onClick={() => {
            window.minimize();
          }}
        >
          <div className="codicon codicon-chrome-minimize" />
        </button>
        <button
          className={styles.windowMaxRestore}
          aria-label="Max or restore window"
          type="button"
          onClick={() => {
            if (this.state.windowIsMaximized) {
              window.unmaximize();
            } else {
              window.maximize();
            }
          }}
        >
          {this.state.windowIsMaximized ? (
            <div className="codicon codicon-chrome-restore" />
          ) : (
            <div className="codicon codicon-chrome-maximize" />
          )}
        </button>
        <button
          className={styles.windowClose}
          aria-label="Close window"
          type="button"
          onClick={() => {
            window.close();
          }}
        >
          <div className="codicon codicon-chrome-close" />
        </button>
      </div>
    );
  }
}

export default Win32WindowControls;
