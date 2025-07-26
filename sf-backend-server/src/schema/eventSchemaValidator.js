const Ajv = require("ajv")
const ajv = new Ajv()

schemaDefinition =  require("./schemaDefinitions.js")

async function validateEventSchema(jsonData){

    const validate = ajv.compile(schemaDefinition.eventSchema)
    const valid = validate(jsonData)

    if (valid) {
    console.log("JSON is valid.")
    return "success"
    } else {
    console.log("Validation errors:", validate.errors)
    return validate.errors
    }


}

module.exports = {validateEventSchema};