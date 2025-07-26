const Ajv = require("ajv")
const ajv = new Ajv()

schemaDefinition =  require("./schemaDefinitions.js")

async function validateImageSchema(jsonData){

    const validate = ajv.compile(schemaDefinition.imageSchema)
    const valid = validate(jsonData)

    if (valid) {
    console.log("JSON is valid.")
    return "success"
    } else {
    console.log("Validation errors:", validate.errors)
    return validate.errors
    }


}

module.exports = {validateImageSchema};