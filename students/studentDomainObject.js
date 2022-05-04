var Error = require("../framework/errors");

class StudentDomainObject {
    constructor(jsonObject, isInsert) {
        this.initialize();

        if (jsonObject)
            this.validateSchema(jsonObject, isInsert);
    }


    valid() {return this.valid;}
    errorMessages() {return this.errorMessages;}
    student() {return this.studentObject;}



    initialize() {
        this.studentObject = {};
        this.valid = true;
        this.errorMessages = [];
    }

    validateSchema(jsonObject, isInsert){

        //check if name is:
        //  null, undefined, NaN, '', 0, false
        if (jsonObject.name){
            this.studentObject.name = jsonObject.name;
        } else if (isInsert) {
            this.valid = false
            this.errorMessages.push('name field is required');
        } else if (!isInsert && jsonObject.name === '') {
            this.valid = false
            this.errorMessages.push('name field is required');
        }

        //optional fields
        if (jsonObject.class != null)
            this.studentObject.class = jsonObject.class;

        if (jsonObject.major != null)
            this.studentObject.major = jsonObject.major;

        //validate that a Senior must have a major.
        if (this.studentObject.class == 'Senior' && !this.studentObject.major){
            this.valid = false;
            this.errorMessages.push('Senior students must have a declared Major');
        }


        if (!this.valid)
            throw new Error.ValidationError(this.errorMessages);
    }
    
}

module.exports = StudentDomainObject;