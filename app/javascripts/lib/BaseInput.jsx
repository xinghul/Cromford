"use strict"

import React from "react"
import _ from "lodash"
import { FormGroup, InputGroup, FormControl, ControlLabel, Glyphicon } from "react-bootstrap"

import styles from "lib/BaseInput.scss"

export default class BaseInput extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  handleChange = (evt) => {
    let newValue = evt.target.value;

    this.setState({
      value: newValue
    });

    this.props.handleChange(newValue);
  };
  
  getValue() {
    return this.state.value;
  }

  render() {
    
    let addonBeforeGlyphicon = null
    ,   controlLabel = null
    ,   selectOptions = null
    ,   validationState = null;
    
    let newProps = _.clone(this.props);

    if (!_.isEmpty(newProps.addonBefore)) {
      addonBeforeGlyphicon = (
        <InputGroup.Addon>
          <Glyphicon glyph={newProps.addonBefore} />
        </InputGroup.Addon>
      );
      
      delete newProps.addonBefore;
    }
    
    if (!_.isEmpty(newProps.label)) {
      controlLabel = (
        <ControlLabel>{newProps.label}</ControlLabel>
      );
      
      delete newProps.label;
    }
    
    if (!_.isEmpty(newProps.validationState)) {
      validationState = newProps.validationState;
      
      delete newProps.validationState;
    }
    
    if (newProps.type === "select") {
      selectOptions = [];
      
      for (let optionValue of newProps.options)
      {
        selectOptions.push(
          <option key={optionValue} value={optionValue}>{optionValue}</option>
        );
      }
      
      delete newProps.options;
    }
    
    // special case for 'select' and 'textarea'
    if (newProps.type === "select" || newProps.type === "textarea") {
      newProps.componentClass = newProps.type;
      
      delete newProps.type;
    }
    
    return (
      <FormGroup className={styles.baseInput} controlId={newProps.key} validationState={validationState}>
        {controlLabel}
        {do {
          if (addonBeforeGlyphicon !== null) {
            <InputGroup>
              {addonBeforeGlyphicon}
              <FormControl 
                {...newProps}
                onChange={this.handleChange}
              >{selectOptions}</FormControl>
            </InputGroup>
          } else {
            <FormControl 
              {...newProps}
              onChange={this.handleChange}
            >{selectOptions}</FormControl>
          }
        }}
      </FormGroup>
      
    );
    
  }
}

BaseInput.propTypes = { 
  // required props
  type: React.PropTypes.string.isRequired,
  
  // most used props
  handleChange: React.PropTypes.func,
  addonBefore: React.PropTypes.string,
  label: React.PropTypes.string
};

BaseInput.defaultProps = {
  handleChange: function() {},
  addonBefore: "",
  label: ""
};