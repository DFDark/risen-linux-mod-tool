import React from 'react';
import { ISettings, IRLMTIPC } from '../../interfaces';

declare global {
  interface Window {
    rlmt: IRLMTIPC;
  }
}

interface IProps {
  currentSettings: ISettings | null;
  onClose: () => void;
  onConfirm: (newSettings: ISettings) => void;
}

interface IState {
  risenExeFolder: string;
  risenModFolder: string;
}

class SettingsModal extends React.PureComponent<IProps, IState> {
  public constructor(props: IProps) {
    super(props);

    this.state = {
      risenExeFolder: '',
      risenModFolder: '',
    };
  }

  public componentDidMount(): void {
    if (this.props.currentSettings) {
      this.setState({
        ...this.state,
        risenExeFolder: this.props.currentSettings.risenExeFolder,
        risenModFolder: this.props.currentSettings.risenModFolder,
      });
    }
  }

  private handleOnExeFolderChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      ...this.state,
      risenExeFolder: event.target.value,
    });
  }

  private handleOnModFolderChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      ...this.state,
      risenModFolder: event.target.value,
    });
  }

  private handleChooseExeFolder = async (): Promise<void> => {
    const result = await window.rlmt.chooseFolderPath();
    
    this.setState({
      ...this.state,
      risenExeFolder: result || '',
    });
  }

  private handleChooseModFolder = async (): Promise<void> => {
    const result = await window.rlmt.chooseFolderPath();
    
    this.setState({
      ...this.state,
      risenModFolder: result || '',
    });
  }

  private handleConfirm = (): void => {
    const {
      risenExeFolder,
      risenModFolder,
    } = this.state;

    this.props.onConfirm({
      risenExeFolder,
      risenModFolder,
    });
  }

  public render(): React.ReactNode {
    const {
      risenExeFolder,
      risenModFolder,
    } = this.state;

    return (<>
      <div className={`modal fade show`} aria-modal={true} role="dialog" style={{ display: 'block' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Settings</h1>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Path to folder containing Risen.exe</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={risenExeFolder}
                    onChange={this.handleOnExeFolderChange}
                  />
                  <div className="input-group-append">
                    <button type="button" className="btn btn-secondary" onClick={this.handleChooseExeFolder}>Choose</button>
                  </div>
                </div>
              </div>
              <div className="form-group mt-2">
                <label>Path to folder containing mods</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={risenModFolder}
                    onChange={this.handleOnModFolderChange}
                  />
                  <div className="input-group-append">
                    <button type="button" className="btn btn-secondary" onClick={this.handleChooseModFolder}>Choose</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer text-right">
              <button type="button" className="btn btn-secondary" onClick={this.props.onClose}>
                Close
              </button>
              <button type="button" className="btn btn-success" onClick={this.handleConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade show`}></div>
    </>);
  }
}

export default SettingsModal;