const Validator = require("Validator")
const isEmpty = require("is-empty")

module.exports = function validateProductInput(data) {
  let errors = {}
// Convert empty fields to an empty string so we can use Validator functions
  data.name = !isEmpty(data.name) ? data.name : ""
  data.price = !isEmpty(data.price) ? data.price : ""
  data.description = !isEmpty(data.description) ? data.description : ""
  data.image = !isEmpty(data.image) ? data.image : ""
// Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required"
  }
// Price checks
  if (Validator.isEmpty(data.price)) {
    errors.price = "Price field is required"
  }
// Description checks
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required"
  }
  // if (Validator.isEmpty(data.image)) {
  //     errors.image = "Image field is required"
  // }
  return {
      errors,
      isValid: isEmpty(errors)
    }
}
