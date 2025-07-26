const Ajv = require("ajv")
const ajv = new Ajv()

schemaDefinition =  require("./schemaDefinitions.js")

async function validateProjectSchema(jsonData){

    const validate = ajv.compile(schemaDefinition.projectSchema)
    const valid = validate(jsonData)

    if (valid) {
    console.log("JSON is valid.")
    return "success"
    } else {
    console.log("Validation errors:", validate.errors)
    return validate.errors
    }


}

module.exports = { validateProjectSchema };