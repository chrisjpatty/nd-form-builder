function Field(construct){
  construct = construct || {};
  this.fieldId = construct.id || 0;
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
}

var formBlocks = [
  {
    id: 1,
    label: "Text Input",
    icon: "text",
    color: "#3f80bf",
    fields: [
      new Field()
    ]
  },
  {
    id: 2,
    label: "Checkbox",
    icon: "check",
    color: "#3f80bf",
    fields: [
      new Field({type: "checkbox", value: "false"})
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
      new Field({type: "select", value: "false"})
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
        title: "Section 1",
        type: "custom",
        sectionId: 1,
        fields: [

        ]
      }
    ]
  }
]

var data = {formBlocks: formBlocks, wizard: wizard};

export default data;
