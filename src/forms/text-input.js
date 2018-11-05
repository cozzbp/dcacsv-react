import React from 'react';
import styled from 'styled-components';

import { colors } from '../theme/theme';

const InputWrapper = styled.div`
  position: relative;
  margin 0 5px;
  
  flex-shrink: 1;

  display: ${(props) => {
    if (props.hidden) return 'none';
    return 'initial';
  }};
`;

const Input = styled.input`
  
  
  font-family: "Roboto";
  font-size: 18px;
  background: none;
  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
  border-image-outset: 0px;
  color: ${colors.white};
  border-color: ${colors.white60};
  padding: 0 10px;
  height: 45px;

  &:hover, &:focus {
    border-color: ${colors.white};
  }
  
  box-sizing: border-box;
  &::-webkit-input-placeholder {
    color: ${colors.white};
  }
  
  border-color: ${(props) => {
    if (props.valid) {
      return colors.white70;
    }

    return colors.red;
  }};

  display: ${(props) => {
    if (props.hidden) return 'none';
    return 'initial';
  }};

  @media only screen and (max-width: 768px) {
    margin-top: 10px;
  }
`;

const Required = styled.p`
  position: absolute;
  color: ${colors.red};
  font-family: "Roboto";
  font-size: 12px;
  top: 5px;
  right: 20px;
  margin: 0;

  
`;


export default class TextInput extends React.Component {
  render() {
    return (
      <InputWrapper hidden={this.props.hidden}>
        {!this.props.valid && <Required>REQUIRED</Required>}
        <Input type="text" className={this.props.className} {...this.props} valid={this.props.valid} hidden={this.props.hidden}>
          {this.props.children}
        </Input>
      </InputWrapper>
    );
  }
}
