import React from 'react';
import styled from 'styled-components';

import { colors } from '../theme/theme';

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  
  flex-shrink: 1;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
    position: relative;
    height: 22px;
    width: 22px;
    appearance: none;
    border: 2px solid ${colors.white60};
    border-radius: 2px;
    cursor: pointer;
    margin: 10px;
    &:checked {
      background: ${colors.blue50};
    }
    &:hover, &:focus {
      border-color: ${colors.white};
    }
`;


export default class CheckboxInput extends React.Component {
  render() {
    return (
      <InputWrapper>
        {this.props.label}
        <Input type="checkbox" className={this.props.className} {...this.props} valid={this.props.valid}>
          {this.props.children}
        </Input>
      </InputWrapper>
    );
  }
}
