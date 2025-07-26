
const studioSchema = {
  type: "object",
  properties: {
    companyName: { type: "string" },
    businessEmail: { type: "string"  },
    mobileNumber: { type: "string"  },
    otp: {type: "string" },
    password: {type: "string" },
    status: {type: "string" },
    started_on: {type: "string"},
    studio_id: {type :"string"}
  },
  required: ["companyName", "businessEmail"],
  additionalProperties: false
}

const projectSchema = {
  type: "object",
  properties: {
    project_id: { type: "string" },
    project_name: { type: "string"  },
    status: {type: "string" },
    created_on: {type: "string"},
    studio_id: {type :"string"}
  },
  required: ["project_name", "studio_id"],
  additionalProperties: false
}

const eventSchema = {
  type: "object",
  properties: {
    event_id: { type: "string" },
    project_id: { type: "string"  },
    event_name: {type: "string" }, 
    created_on: {type: "string" },
    status: {type: "string" }
  },
  required: ["project_id", "event_name"],
  additionalProperties: false
}


const folderSchema = {
  type: "object",
  properties: {
    folder_id: { type: "string" },
    event_id: { type: "string"  },
    folder_name: {type: "string" }, 
    created_on: {type: "string" },
    status: {type: "string" },
    base_path: {type: "string"},
    thumbnail_base_path: {type: "string"},
    total_images: {type: "number"},
    total_studio_sel_img: {type: "number"},
    total_client_sel_img: {type: "number"},
    total_client_fav_img: {type: "number"}
  },
  required: ["event_id", "folder_name"],
  additionalProperties: false
}

const imageSchema = {
  type: "object",
  properties: {
    image_id: { type: "string" },
    folder_id: { type: "string"  },
    project_id :{type : "string" },
    relative_path: {type: "string" },
    selected: {type: "array", default:[]},
    favourite: {type: "array", default:[]},
    created_on: {type: "string" },
    image_order: {type: "number" }
  },
  required: ["folder_id","project_id", "relative_path", "image_order"],
  additionalProperties: false
}


module.exports = { studioSchema, projectSchema, eventSchema, folderSchema, imageSchema }