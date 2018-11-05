import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import TopBar from './top-bar/top-bar';
import LandingPage from './landing-page/landing-page';
import './Main.scss';

const RootWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: auto;
`;

const ContentWrapper = styled.div`
  margin-bottom: 100px;
`;


class LocationListener extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    return this.props.children;
  }
}

export default class Root extends React.Component {
  render() {
    return (
      <div className="App">
        <HashRouter hashType={'hashbang'}>
          <LocationListener>
            <RootWrapper id="root_wrapper">
              {/* <TopBar/>*/}
              <ContentWrapper id="content">
                <Switch>
                  <Route exact path="/" component={LandingPage}/>
                </Switch>
              </ContentWrapper>
            </RootWrapper>
          </LocationListener>
        </HashRouter>
      </div>
    );
  }
}
