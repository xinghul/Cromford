"use strict"

import React from "react"
import { Grid, Row, Col } from "react-bootstrap"

import AuthStore from "stores/AuthStore"
import LocalInfo from "./AccountApp/LocalInfo"
import FacebookInfo from "./AccountApp/FacebookInfo"

import styles from "components/AccountApp.scss"

function getStateFromStores() {
  return {
    user: AuthStore.getUser()
  };
}

export default class AccountApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = getStateFromStores();
  }
  
  componentDidMount() {
    AuthStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onChange);
  }
  
  _onChange = () => {
    this.setState(getStateFromStores());
  };

  render() {
    
    return (
      <Grid fluid className={styles.accountApp}>
        <Row>
          <Col md={6} xs={12}>
            <LocalInfo info={this.state.user} />
          </Col>
          <Col md={6} xs={12}>
            <FacebookInfo user={this.state.user} />
          </Col>          
        </Row>
      </Grid>
    );
    
  }

}
