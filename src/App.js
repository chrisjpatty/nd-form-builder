import React, { Component } from 'react';
import './bootstrap.min.css';
import './App.css';
import './wizard.css';
import data from './formBlocks.js';
//import wizard from './formBlocks.js';
// var DragDropContext = require('react-dnd').DragDropContext;
// var HTML5Backend = require('react-dnd-html5-backend');
// var PropTypes = React.PropTypes;
// global.jQuery = require('jquery');
// import './bootstrap/js/bootstrap.js';

var App = React.createClass({
  getInitialState: function(){
    return{
      formBlocks: data.formBlocks,
      wizard: data.wizard,
      activeView: 1
    }
  },
  onDragOver: function(e){
    e.preventDefault();
  },
  onDragEnter: function(e){
    e.preventDefault();
  },
  drop: function(e){
    e.preventDefault();
    console.log(JSON.parse(e.dataTransfer.getData("text")));
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
  render() {
    console.log("formBlocks", data.formBlocks);
    console.log("wizard", this.state.wizard);
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
        <div className="app-body" onDragOver={this.onDragOver} onDragEnter={this.onDragEnter} onDrop={this.drop}>
          <div className="wizard">
            <div className="wizard-sidebar">
              {
                this.state.wizard.map(function(step, i){
                  return <Step step={step} key={i}/>
                })
              }
            </div>
            <div className="wizard-body">
              <WizardBody data={this.getViewData()}/>
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
  render: function(){
    return(
      <div>
        {
          this.props.data.map(function(section, i){
            return <Section section={section} key={i} />
          })
        }
      </div>
    )
  }
})

var Section = React.createClass({
  render: function(){
    return(
      <div className="wizard-section">
        <h4 className="section-title">{this.props.section.title}</h4>
      </div>
    )
  }
})

export default App;
