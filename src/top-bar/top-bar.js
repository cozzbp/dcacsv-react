import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { colors } from '../theme/theme';

const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 95%;
  max-width: 1300px;
  margin: 2% 5% 280px 5%;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 5%;
  }
`;

const LinkBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Oswald;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-self: center;
  }
`;

const PageLink = styled(Link)`
  font-size: 20px;
  text-transform: uppercase;
  margin: 1% 0.1%;
  padding: 0.5rem 1rem;
  text-decoration: inherit;
  color: ${colors.white};

  &:hover {
    color: ${colors.white60};
  }

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`;


export default class TopBar extends React.Component {
  render() {
    return (
      <Top>
        <LinkBar>
          <PageLink to="/">Home</PageLink>
        </LinkBar>
      </Top>
    );
  }
}
