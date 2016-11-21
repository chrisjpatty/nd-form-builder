/* eslint-disable */
import React, { Component } from 'react';
import './bootstrap.min.css';
import './App.css';
import './wizard.css';
import data from './formBlocks.js';
import 'animate.css';
//import wizard from './formBlocks.js';
// var DragDropContext = require('react-dnd').DragDropContext;
// var HTML5Backend = require('react-dnd-html5-backend');
// var PropTypes = React.PropTypes;
// global.jQuery = require('jquery');
// import './bootstrap/js/bootstrap.js';
var sectionIterator = 2;

var App = React.createClass({
  getInitialState: function(){
    return{
      formBlocks: data.formBlocks,
      wizard: data.wizard,
      activeView: 1
    }
  },
  getViewData: function(){
      var data = this.state.wizard;
      var found = null;
      var activeView = this.state.activeView;
      data.filter(function (step) {
          if (step.itemId == activeView) {
              found = step.sections;
          }
      })
      return found;
  },
  addFields: function(fields){
    var wizard = this.state.wizard;
    var capture = this;

    wizard = wizard.filter(function(item){
      if(item.itemId == capture.state.activeView){
        item.sections.filter(function(section){
          if(section.sectionId == fields.sectionId){
            section.fields.push(fields.fields);
          }
          return section;
        })
      }
      return item;
    })
    console.log(wizard);
    this.setState({
      wizard: wizard
    })
  },
  addSection: function(){
    var wizard = this.state.wizard;
    var capture = this;

    wizard = wizard.filter(function(item){
      if(item.itemId == capture.state.activeView){
        var sections = item.sections;
        sections.push(new SectionObject());
        item.sections = sections;
      }
      return item;
    })
    console.log(wizard);
    this.setState({
      wizard: wizard
    })
  },
  render() {
    // console.log("formBlocks", data.formBlocks);
    // console.log("wizard", this.state.wizard);
    return (
      <div className="container-fluid">
        <div className='app-header'>

        </div>
        <div className="app-sidebar sidebar-left">
          {
            this.state.formBlocks.map(function(block, i){
              return <FormBlock block={block} key={i} />
            })
          }
        </div>
        <div className="app-body">
          <div className="wizard">
            <div className="wizard-sidebar">
              {
                this.state.wizard.map(function(step, i){
                  return <Step step={step} key={i}/>
                })
              }
              <button className="wizard-step wizard-add-step">+ Add a new step</button>
            </div>
            <div className="wizard-body">
              <WizardBody data={this.getViewData()} addFields={this.addFields} addSection={this.addSection}/>
            </div>
          </div>
        </div>
        <div className="app-sidebar sidebar-right" onClick={this.clickTest}>

        </div>
      </div>
    );
  }
})

var FormBlock = React.createClass({
  onDragStart: function(e){
    //console.log(JSON.stringify(this.props.block.fields));
    e.dataTransfer.setData("text",JSON.stringify(this.props.block.fields));
  },
  onDragEnd: function(e){

  },
  render(){
    return(
      <div className="block draggable" onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} draggable="true">
        <div className="block-icon"></div>
        <label className="block-label">{this.props.block.label}</label>
      </div>
    )
  }
})

var Step = React.createClass({
  render: function(){
    return(
      <button className="wizard-step">{this.props.step.viewLabel}</button>
    )
  }
})

var WizardBody = React.createClass({
  addFields: function(fields){
    this.props.addFields(fields);
  },
  addSection: function(){
    this.props.addSection();
  },
  render: function(){
    return(
      <div>
        {
          this.props.data.map(function(section, i){
            return <Section section={section} addFields={this.addFields} key={i} />
          }, this)
        }
        <div className="add-section" onClick={this.addSection}>+ Add a new section</div>
      </div>
    )
  }
})

var Section = React.createClass({
  getInitialState: function(){
    return{
      showTarget: false,
      counter: 0,
      pointerEvents: "all"
    }
  },
  onDragOver: function(e){
    e.preventDefault();
  },
  onDragEnter: function(e){
    e.preventDefault();
    this.setState({
      showTarget: true,
      pointerEvents: "none"
    })
  },
  onDragLeave: function(e){
    e.preventDefault();
    // var cords = document.elementFromPoint(e.pageX, e.pageY);
    // var targetClass = cords.className;
    // var targetId = cords.id;
    this.setState({
      showTarget: false,
      pointerEvents: ""
    })
  },
  drop: function(e){
    e.preventDefault();
    var capture = this;
    var fields = JSON.parse(e.dataTransfer.getData("text"));
    //console.log(fields);
    this.setState({
      showTarget: false
    })
    this.props.addFields({fields: fields, sectionId: capture.props.section.sectionId});
  },
  render: function(){
    var noPointer = {pointerEvents: this.state.pointerEvents};
    return(
      <div className="wizard-section" onDragOver={this.onDragOver} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} onDrop={this.drop}>
        <h4 className="section-title" style={noPointer}>{this.props.section.title}</h4>
        <div style={noPointer}>
        {
          this.props.section.fields.map(function(field, i){
            return <Field field={field} key={i}/>
          })
        }
        </div>
        {
          this.state.showTarget ?
          <div className="drop-target" style={noPointer} id={'drop' + this.props.section.sectionId}>Drop to add field(s)</div>
          :
          null
        }
      </div>
    )
  }
})

var Field = React.createClass({
    getField: function(){
        var field = this.props.field[0];
        // console.log("Field", field);
        // console.log(field.type);
        var style = {
            width: field.width,
            clear: field.clear
        }
        var valid = null;
        if (field.isValid) {
            valid = "valid"
        } else if(field.isValid == null) {
            valid = ""
        } else {
            valid = "invalid"
        }
        switch (field.type) {
            case "text":
                return (
                    <div className="body-field-wrapper body-text-field" style={style}>
                        <label className={field.required ? "text-label required" : "text-label " } >{field.label}</label>
                        <span className={"input-wrapper " + valid}>
                            <input type="text" value={field.value} readOnly />
                        </span>
                    </div>
                )
                break;
            case "conditionalCheck":
            case "check":
                return (
                    <div className="body-field-wrapper body-check-field" style={style}>
                        <input type="checkbox" id={field.conditionalId} value={field.value} checked={field.value} readOnly />
                        <label className={"input-wrapper " + valid} htmlFor={field.conditionalId}></label>
                        <label className={field.required ? "text-label required" : "text-label " }>{field.label}</label>
                    </div>
                )
                break;
            case "select":
                return (
                    <div className="body-field-wrapper body-select-field" style={style}>
                        <label className="text-label">{field.label}</label>
                        <select>
                            {
                                field.options.map(function (option,i) {
                                    return <option key={i}>{option}</option>
                                })
                            }
                        </select>
                    </div>
                )
        }
    },
    render: function () {
        return(
            <div>
                {
                    this.getField()
                }
            </div>
        )
    }
})

function SectionObject(construct){
  construct = construct || {};
  this.title = construct.title || "Section " + sectionIterator;
  this.type = construct.type || "custom";
  this.sectionId = construct.sectionId || sectionIterator;
  this.fields = construct.fields || [];
  sectionIterator++;
}

export default App;
