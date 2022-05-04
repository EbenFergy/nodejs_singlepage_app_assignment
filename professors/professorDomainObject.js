var Error = require("../framework/errors");

class professorDomainObject {
    constructor(jsonObject, isInsert) {
        this.initialize();

        if (jsonObject)
            this.validateSchema(jsonObject, isInsert);
    }


    valid() {return this.valid;}
    errorMessages() {return this.errorMessages;}
    professor() {return this.professorObject;}



    initialize() {
        this.professorObject = {};
        this.valid = true;
        this.errorMessages = [];
    }

    validateSchema(jsonObject, isInsert){

        //check if name is:
        //  null, undefined, NaN, '', 0, false
        if (jsonObject.name){
            this.professorObject.name = jsonObject.name;
        } else if (isInsert) {
            this.valid = false
            this.errorMessages.push('name field is required');
        } else if (!isInsert && jsonObject.name === '') {
            this.valid = false
            this.errorMessages.push('name field is required');
        }
        
        //Optional fields
        if (jsonObject.title != null)
            this.professorObject.title = jsonObject.title;

        if (jsonObject.department != null)
            this.professorObject.department = jsonObject.department;

        if (!this.valid)
            throw new Error.ValidationError(this.errorMessages);
    }
    
}

module.exports = professorDomainObject;