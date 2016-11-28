/* eslint-disable */
import React, { Component } from 'react';
import './bootstrap.min.css';
import './App.css';
import './wizard.css';
import './sidebar.css';
import data from './formBlocks.js';
import 'animate.css';
var shortid = require('shortid');
import $ from "jquery";
//global.localStorage = require('localStorage')
var store = require('store');
//import wizard from './formBlocks.js';
// var DragDropContext = require('react-dnd').DragDropContext;
// var HTML5Backend = require('react-dnd-html5-backend');
// var PropTypes = React.PropTypes;
// global.jQuery = require('jquery');
// import './bootstrap/js/bootstrap.js';
var sectionIterator = 2;
var itemIterator = 2;
console.log(data);
var App = React.createClass({
  getInitialState: function(){
    return{
      formBlocks: data.formBlocks,
      wizard: data.wizard,
      activeView: 1,
      properties: [],
      propObj: null
    }
  },
  setView: function(itemId){
    var wizard = this.state.wizard;

    wizard = wizard.filter(function(item){
        if(item.itemId == itemId){
          item.active = true;
        }else{
          item.active = false;
        }
        item.sections.filter(function(section){
          section.editing = false;
          section.fields.filter(function(field){
            field.editing = false;
            return field;
          })
          return section;
        })
        return item;
    })

    this.setState({
      wizard: wizard,
      activeView: itemId,
      propObj: {type: "item", itemId: itemId}
    })
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
            fields.fields.filter(function(field){
              field.fieldId = shortid.generate();
              section.fields.push(field);
            })
          }
          return section;
        })
      }
      return item;
    })
    //console.log(wizard);
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
    //console.log(wizard);
    this.setState({
      wizard: wizard
    })
  },
  addItem: function(){
    var wizard = this.state.wizard;
    wizard.push(new ItemObject());
    this.setState({
      wizard: wizard
    })
  },
  setPropObj: function(propertyObj){
    //console.log(propertyObj)
    this.setState({
      propObj: propertyObj
    })
  },
  getProperties: function(){
    var itemId = this.state.activeView;
    var wizard = this.state.wizard;
    var propObj = this.state.propObj || {};

    switch (propObj.type) {
      case "item":
        var found;
        wizard = wizard.filter(function(item){
          if(item.itemId == itemId){
            found = item;
          }
        })
        var mapped = {
          type: "item",
          itemId: itemId,
          sectionId: propObj.sectionId,
          fields: [
            {
              label: "Title",
              key: "viewLabel",
              id: found.itemId,
              type: "text",
              value: found.viewLabel
            }
          ]
        }
        return mapped;
        break;
      case "section":
        var found;
        wizard = wizard.filter(function(item){
          if(item.itemId == itemId){
            item.sections.filter(function(section){
              if(section.sectionId == propObj.sectionId){
                found = section;
                section.editing = true;
                section.fields.filter(function(field){
                  field.editing = false;
                  return field;
                })
              }else{
                section.editing = false;
              }
              return section;
            })
          }
          return item;
        })
        var mapped = {
          type: "section",
          itemId: itemId,
          sectionId: propObj.sectionId,
          fields: [
            {
              label: "Title",
              key: "title",
              id: found.sectionId,
              type: "text",
              value: found.title
            }
          ]
        }
        return mapped;
        break;
      case "field":
        var found;
        var mapped = {
          type: "field",
          itemId: itemId,
          sectionId: propObj.sectionId,
          fieldId: propObj.fieldId,
          fields: []
        }
        wizard = wizard.filter(function(item){
          if(item.itemId == itemId){
            item.sections.filter(function(section){
              section.editing = false;
              if(section.sectionId == propObj.sectionId){
                section.fields.filter(function(field){
                  if(field.fieldId == propObj.fieldId){
                    found = field;
                    field.editing = true;
                  }else{
                    field.editing = false;
                  }
                  return field;
                })
              }
              return section;
            })
          }
          return item;
        })
        $.each(found, function(k, v){
          if(k != "fieldId" && k != "type" && k != "isValid" && k != "editing"){
            switch (found.type) {
              case "text":
                var field = {
                  label: (k.charAt(0).toUpperCase() + k.slice(1)).replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1"),
                  key: k,
                  type: (k == "required" || k == "sizeOverride" ? "check" : "text"),
                  value: (v == null ? "" : v)
                }
                break;
              case "check":
                var field = {
                  label: (k == "value" ? "Checked" : (k.charAt(0).toUpperCase() + k.slice(1)).replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")),
                  key: k,
                  type: (k == "value" || k == "required" || k == "sizeOverride" ? "check" : "text"),
                  value: (v == null ? "" : v)
                }
                break;
              default:
                var field = {
                  label: (k.charAt(0).toUpperCase() + k.slice(1)).replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1"),
                  key: k,
                  type: (k == "required" || k == "sizeOverride" ? "check" : "text"),
                  value: (v == null ? "" : v)
                }
            }
            mapped.fields.push(field);
          }
        })
        return mapped;
        break;
      default:
        return null;
    }
    this.setState({
      wizard: wizard
    })
  },
  setProperty: function(prop){
    var wizard = this.state.wizard;
    // console.log(prop);
    switch (prop.type) {
      case "item":
        wizard = wizard.filter(function(item){
          if(item.itemId == prop.itemId){
            item[prop.key] = prop.value;
          }
          return item;
        })
        break;
      case "section":
        wizard = wizard.filter(function(item){
          if(item.itemId == prop.itemId){
            item.sections.filter(function(section){
              if(section.sectionId == prop.sectionId){
                section[prop.key] = prop.value;
              }
              return section;
            })
          }
          return item;
        })
        break;
      case "field":
        wizard = wizard.filter(function(item){
          if(item.itemId == prop.itemId){
            item.sections.filter(function(section){
              if(section.sectionId == prop.sectionId){
                section.fields.filter(function(field){
                  if(field.fieldId == prop.fieldId){
                    field[prop.key] = prop.value;
                  }
                  return field;
                })
              }
              return section;
            })
          }
          return item;
        })
        break;
      default:
    }
    this.setState({
      wizard: wizard
    })
  },
  export: function(){
    console.log(this.state.wizard)
  },
  render() {
    // console.log("formBlocks", data.formBlocks);
    // console.log("wizard", this.state.wizard);
    return (
      <div className="container-fluid">
        <div className='app-header'>
          <button onClick={this.export}>Export</button>
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
                  return <Step step={step} key={i} setView={this.setView}/>
                }, this)
              }
              <button className="wizard-step wizard-add-step" onClick={this.addItem}>+ Add a new step</button>
            </div>
            <div className="wizard-body">
              <WizardBody data={this.getViewData()} setPropObj={this.setPropObj} addFields={this.addFields} addSection={this.addSection}/>
            </div>
          </div>
        </div>
        <div className="app-sidebar sidebar-right">
          <RightSidebar setProperty={this.setProperty} properties={this.getProperties()} />
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
  setView: function() {
    this.props.setView(this.props.step.itemId);
  },
  render: function(){
    return(
      <button className={"wizard-step " + (this.props.step.active ? "active " : "")} onClick={this.setView}>{this.props.step.viewLabel}</button>
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
  setPropObj: function(properties){
    this.props.setPropObj(properties);
  },
  render: function(){
    return(
      <div>
        {
          this.props.data.map(function(section, i){
            return <Section section={section} addFields={this.addFields} setPropObj={this.setPropObj} key={i} />
          }, this)
        }
        <div className="add-section" onClick={this.addSection}>+ Add a new section</div>
      </div>
    )
  }
})

var RightSidebar = React.createClass({
  setProperty: function(prop){
    prop.type = this.props.properties.type;
    prop.itemId = this.props.properties.itemId;
    prop.sectionId = this.props.properties.sectionId;
    prop.fieldId = this.props.properties.fieldId;
    this.props.setProperty(prop);
  },
  render: function(){
    //console.log(this.props.properties);
    return(
      <div className="props-wrapper">
        {
          this.props.properties != null ?
          this.props.properties.fields.map(function(prop, i){
            return <Property property={prop} setProperty={this.setProperty} key={i}/>
          }, this)
          :
          null
        }
      </div>
    )
  }
})

var Property = React.createClass({
  setProperty: function(e){
    var val = (this.props.property.type == "check" ? e.target.checked : e.target.value);
    this.props.setProperty({key: this.props.property.key, value: val});
  },
  getField: function(){
    var props = this.props.property;
    //console.log("Props", props);
    switch (props.type) {
      case "text":
        return(
          <div className="prop">
            <label>{props.label}</label>
            <input type="text" className="prop-text" onChange={this.setProperty} value={props.value}/>
          </div>
        )
        break;
      case "check":
        var id = shortid.generate();
        return(
          <div className="prop">
          <label>{props.label}</label>
          <input type="checkbox" id={id} className="prop-check" onChange={this.setProperty} checked={props.value}/>
          <label className="input-wrapper" htmlFor={id}></label>
          </div>
        )
      default:

    }
  },
  render: function(){
    return(
      <div className="prop-wrapper">
        {
          this.getField()
        }
      </div>
    )
  }
})

var Section = React.createClass({
  getInitialState: function(){
    return{
      showTarget: false,
      counter: 0,
      pointerEvents: "all",
      active: ""
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
      showTarget: false,
      pointerEvents: ""
    })
    this.props.addFields({fields: fields, sectionId: capture.props.section.sectionId});
  },
  setPropObj: function(propObj){
    var type = "section";
    if(propObj.type != 'click')
      type = propObj.type;
    this.props.setPropObj({type: type, sectionId: this.props.section.sectionId, fieldId: propObj.fieldId});
    // this.setState({
    //   active: "active"
    // })
  },
  render: function(){
    var noPointer = {pointerEvents: this.state.pointerEvents};
    return(
      <div className="wizard-section" onDragOver={this.onDragOver} onDragEnter={this.onDragEnter} onDragLeave={this.onDragLeave} onDrop={this.drop}>
        <h4 className={"section-title " + (this.props.section.editing ? "editing " : "")} onClick={this.setPropObj} style={noPointer}>{this.props.section.title}</h4>
        <div style={noPointer}>
        {
          this.props.section.fields.length > 0 ?
          this.props.section.fields.map(function(field, i){
            return <Field field={field} setPropObj={this.setPropObj} key={i}/>
          }, this)
          :
          null
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
        var field = this.props.field;
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
                    <div className={"body-field-wrapper body-text-field " + (field.editing ? "editing " : "")} onClick={this.setPropObj} style={style}>
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
                    <div className={"body-field-wrapper body-check-field " + (field.editing ? "editing " : "")} onClick={this.setPropObj} style={style}>
                        <input type="checkbox" id={field.conditionalId} value={field.value} checked={field.value} readOnly />
                        <label className={"input-wrapper " + valid} htmlFor={field.conditionalId}></label>
                        <label className={field.required ? "text-label required" : "text-label " }>{field.label}</label>
                    </div>
                )
                break;
            case "select":
                return (
                    <div className={"body-field-wrapper body-select-field " + (field.editing ? "editing " : "")} onClick={this.setPropObj} style={style} readOnly>
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
    setPropObj: function(){
      this.props.setPropObj({type: "field", fieldId: this.props.field.fieldId});
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

function ItemObject(construct){
  construct = construct || {};
  this.viewLabel = construct.viewLabel || "Step " + itemIterator;
  this.active = construct.type || false;
  this.itemId = construct.itemId || shortid.generate();
  this.sections = construct.sections || [new SectionObject()];
  itemIterator++;
}

function SectionObject(construct){
  construct = construct || {};
  this.title = construct.title || "Section Title";
  this.type = construct.type || "custom";
  this.sectionId = construct.sectionId || shortid.generate();
  this.editing = construct.editing || false;
  this.fields = construct.fields || [];
  sectionIterator++;
}

export default App;
