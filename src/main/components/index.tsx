import React from 'react';
import styled from 'styled-components';
import { IMod } from '../../interfaces';

const StatusRow = styled.div`
  /* background-color: #545A6A; */
  color: var(--bs-light);
  font-weight: bold;

  & > span.activated > strong {
    color: var(--bs-success);
  }
  & > span.selected > strong {
    color: var(--bs-primary);
  }
`;

const BorderDiv = styled.div`
  border: 1px solid var(--bs-light);
  border-radius: 3px;
`;

const ModRowWrapper = styled.div<{ active: boolean; }>`
  margin: 0px 5px;
  padding: 1px 5px;
  font-size: 14px;
  background-color: ${props => props.active ? '#469F76' : '#878B96'};
  border-radius: 3px;
  margin-top: 5px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.active ? '#75B798' : '#9FA2AB'};
  }
`;

interface IModRowProps {
  index: number;
  mod: IMod;
  checked: boolean;
  active: boolean;
  onModCheck: (index: number, activation: boolean) => void;
  onModSelected: (index: number) => void;
}

const ModRow: React.FC<IModRowProps> = ({ index, mod, checked, active, onModSelected, onModCheck }: IModRowProps) => {
  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();

    // https://www.reddit.com/r/reactjs/comments/8unyps/am_i_doing_stupid_or_is_this_a_bug_checkbox_not/
    // Like WTF?? WHY?
    // event.preventDefault();

    onModCheck(index, event.target.checked);
  }

  return (<ModRowWrapper className="d-flex justify-content-between" active={active}>
    <div className="form-check" style={{ minHeight: 'auto' }}>
      <input
        type="checkbox"
        className="form-check-input"
        checked={checked}
        // defaultChecked={active}
        onChange={handleStateChange}
      />
    </div>
    <div className="flex-fill" onClick={() => onModSelected(index)}>{mod.name}</div>
  </ModRowWrapper>);
}

export {
  StatusRow,
  BorderDiv,
  ModRow,
};