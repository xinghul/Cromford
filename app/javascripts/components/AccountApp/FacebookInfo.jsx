"use strict";

import React from "react"
import _ from "lodash"

import SocialButton from "lib/SocialButton"

import AccountAction from "actions/AccountAction"

export default class FacebookInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  
  onConnectFacebookClick = () => {
    AccountAction.connectFacebook().then(function(result) {
      console.log(result);
    }).catch(function(err) {
      console.log(err);
    });
  };
  
  render() {
    let user = this.props.user
    ,   facebookInfo = user.facebook
    ,   localInfo = user
    ,   infoArea;
    
    if (_.isEmpty(facebookInfo)) {
      if (_.isEmpty(localInfo)) {
        infoArea = (
          <div>Register with email before you can bind Facebook account.</div>
        ); 
      } else {
        infoArea = (
          <SocialButton type="facebook" leadingText="Connect"/>
        );        
      }
    } else {
      infoArea = (
        <div>
          <img src={facebookInfo.photo} />
          <div>{facebookInfo.nickname}</div>
        </div>
      );
    }
    
    return (
      <div>
        {infoArea}
      </div>
    );
  }
};

FacebookInfo.propTypes = {
  user: React.PropTypes.object.isRequired
};