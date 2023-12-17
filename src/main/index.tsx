import React from 'react';
import {
  initializationRequest,
  changeSettings,
  selectModRequest,
  activateModRequest,
  checkMod,
} from './actions';
import { createStructuredSelector } from 'reselect';
import {
  makeSelectInitialized,
  makeSelectInitializing,
  makeSelectMods,
  makeSelectSettings,
  makeSelectSelectedMod,
  makeSelectModActivating,
  makeSelectCheckedMods,
  makeSelectActivatedMods,
} from './selectors';
import { Dispatch, bindActionCreators } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import {
  StatusRow,
  BorderDiv,
  ModRow,
} from './components';
import { Scrollbars } from 'react-custom-scrollbars';
import { IMod, ISettings } from '../interfaces';
import SettingsModal from './components/SettingsModal';

interface IStateProps {
  initializing: boolean;
  initialized: boolean;
  settings: ISettings | null;
  mods: IMod[];
  selectedMod: IMod | null;
  activating: boolean;
  checkedMods: Map<string, boolean>;
  activatedMods: string[];
}

interface IProps extends IStateProps {
  initializationRequest: typeof initializationRequest;
  changeSettings: typeof changeSettings;
  selectModRequest: typeof selectModRequest;
  activateModRequest: typeof activateModRequest;
  checkMod: typeof checkMod;
}

interface IState {
  settingsModal: boolean;
}

class Main extends React.PureComponent<IProps, IState> {
  public constructor(props: IProps) {
    super(props);

    this.state = {
      settingsModal: false,
    };

    props.initializationRequest();
  }

  public componentDidUpdate(prev: Readonly<IProps>): void {
    const {
      initialized,
      settings,
    } = this.props;
    if (!prev.initialized && initialized && !settings) {
      this.showSettings();
    }
  }

  private showSettings = () => {
    this.setState({
      ...this.state,
      settingsModal: true,
    });
  }

  private closeSettings = () => {
    this.setState({
      ...this.state,
      settingsModal: false,
    });
  }

  private handleChangeSettings = (newSettings: ISettings) => {
    this.setState({
      ...this.state,
      settingsModal: false,
    });
    this.props.changeSettings(newSettings);
  }

  private handleOnModSelected = (index: number) => {
    this.props.selectModRequest(index);
  }

  private handleOnModCheck = (index: number, activation: boolean) => {
    this.props.checkMod(index, activation);
  }

  public render(): React.ReactNode {
    const {
      settings,
      mods,
      selectedMod,
      activating,
      checkedMods,
      activatedMods,
    } = this.props;
    const {
      settingsModal,
    } = this.state;

    return (<div className="d-flex flex-column flex-fill position-relative">
      <div className="d-flex" style={{ gap: 10 }}>
        <div className="flex-fill">
          <StatusRow>
            Some status
          </StatusRow>
        </div>
        <div className="d-flex justify-content-end">
          <button type='button' className="btn btn-success btn-sm" onClick={this.props.activateModRequest}>
            Apply mods
          </button>
          <button type='button' className="btn btn-secondary btn-sm ms-2" onClick={this.showSettings}>
            Settings
          </button>
        </div>
      </div>
      <div className="mt-2 d-flex h-100 justify-content-between align-self-stretch" style={{ gap: 10 }}>
        <div className="align-self-stretch d-flex flex-column" style={{ flex: 2 }}>
          <div style={{ flexShrink: 0.5, maxHeight: 400, maxWidth:  400 }}>
            {selectedMod && selectedMod.image && (<img
              src={`data:image/jpg;base64,${selectedMod.image}`}
              alt={selectedMod.name}
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />)}
          </div>
          <h4 className="text-white">{selectedMod && selectedMod.name}</h4>
          <BorderDiv style={{ flex: 1, backgroundColor: '#B2B4BB' }}>
            <Scrollbars style={{ width: '100%', height: '100%' }}>
              {selectedMod && <div dangerouslySetInnerHTML={{ __html: selectedMod.description }}></div>}
            </Scrollbars>
          </BorderDiv>
        </div>
        <BorderDiv className="align-self-stretch" style={{ flex: 1 }}>
          <Scrollbars style={{ width: '100%', height: '100%' }}>
            {mods.map((mod, idx) => {
              const isActive = activatedMods.indexOf(mod.path) !== -1;
              return (<ModRow
                key={`mod-row-${idx}`}
                index={idx}
                mod={mod}
                checked={checkedMods.get(mod.path) || false}
                active={isActive}
                onModSelected={this.handleOnModSelected}
                onModCheck={this.handleOnModCheck}
              />);
            })}
          </Scrollbars>
        </BorderDiv>
      </div>
      {settingsModal && <SettingsModal
        currentSettings={settings}
        onConfirm={this.handleChangeSettings}
        onClose={this.closeSettings}
      />}
      {activating && <div className="position-fixed d-flex justify-content-center align-items-center w-100 h-100">
        <div className="spinner-border text-light" role="status" style={{ zIndex: 10000 }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className={`modal-backdrop fade show`}></div>
      </div>}
    </div>);
  }
}

const mapStateToProps = createStructuredSelector({
  initializing: makeSelectInitializing(),
  initialized: makeSelectInitialized(),
  settings: makeSelectSettings(),
  mods: makeSelectMods(),
  selectedMod: makeSelectSelectedMod(),
  activating: makeSelectModActivating(),
  checkedMods: makeSelectCheckedMods(),
  activatedMods: makeSelectActivatedMods(),
});

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators({
    initializationRequest,
    changeSettings,
    selectModRequest,
    activateModRequest,
    checkMod,
  }, dispatch);
}
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect(Main);