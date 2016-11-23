/* eslint-disable */
var shortid = require("shortid");

function Field(construct){
  construct = construct || {};
  this.fieldId = construct.id || shortid.generate();
  this.type = construct.type || "text";
  this.label = construct.label || "Label";
  this.sizeOverride = construct.sizeOverride || false;
  this.width = construct.width || "70%";
  this.clear = construct.clear || "both";
  this.placeholder = construct.placeholder || "";
  this.value = construct.value || "";
  this.required = construct.required || false;
  this.allowedValues = construct.allowedValues || "all";
  this.isValid = construct.isValid || null;
  if(construct.type == "select"){
    this.options = construct.options || [];
  }
}

var formBlocks = [
  {
    id: 1,
    label: "Text Input",
    icon: "glyphicon-text-size",
    color: "#3f80bf",
    fields: [
      new Field()
    ]
  },
  {
    id: 2,
    label: "Checkbox",
    icon: "glyphicon-check",
    color: "#3f80bf",
    fields: [
      new Field({type: "check", value: "false"})
    ]
  },
  {
    id: 3,
    label: "Radio",
    icon: "radio",
    color: "#3f80bf",
    fields: [
      new Field({type: "radio", value: "false"})
    ]
  },
  {
    id: 4,
    label: "Dropdown",
    icon: "dropdown",
    color: "#3f80bf",
    fields: [
      new Field({type: "select", value: "false", options: ["Domestic Limited Liability Corporation","Foreign Limited Liability Corporation","Sole Proprietorship"]})
    ]
  },
  {
    id: 5,
    label: "Name Block",
    icon: "name",
    color: "#3f80bf",
    fields: [
      new Field({label: "First", sizeOverride: true, width: "40%", clear: "left"}),
      new Field({label: "M",sizeOverride: true, width: "10%", clear: "none"}),
      new Field({label: "Last",sizeOverride: true, width: "40%", clear: "none"})
    ]
  },
  {
    id: 6,
    label: "Address Block",
    color: "#3f80bf",
    fields: [
      new Field({label: "Street Address", sizeOverride: true, width: "70%"}),
      new Field({label: "City", sizeOverride: true, width: "40%", clear: "left"}),
      new Field({label: "State", sizeOverride: true, width: "20%", clear: "right"}),
      new Field({label: "Postal Code", sizeOverride: true, width: "30%"}),
    ]
  }
]

var wizard = [
  {
    itemId: 1,
    viewLabel: "Step 1",
    active: true,
    sections: [
      {
        title: "Section Title",
        type: "custom",
        sectionId: shortid.generate(),
        fields: [

        ]
      }
    ]
  }
]

var data = {formBlocks: formBlocks, wizard: wizard};

export default data;
