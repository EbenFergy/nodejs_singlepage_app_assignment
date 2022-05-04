var Errors = require('../../framework/errors')

class StudentDomainObjectMockValid {
    constructor(jsonObject, isInsert) {

        this.valid = true;
        this.errorMessages = [];
        this.studentObject = {name: 'Ryan Florin', class: 'Senior', major: 'Computer Science'};
    }

    valid() {return this.valid;}
    errorMessages() {return this.errorMessages;}
    student() {return this.studentObject;}
}

class StudentDomainObjectMockInvalid {
    constructor(jsonObject, isInsert) {
        this.valid = false;
        this.errorMessages = ['Failure in StudentDomainModel.constructor'];
        this.studentObject = {};

        throw new Errors.ValidationError(this.errorMessages);
    }

    valid() {return this.valid;}
    errorMessages() {return this.errorMessages;}
    student() {return this.studentObject;}
}


module.exports.StudentDomainObjectMockValid = StudentDomainObjectMockValid;
module.exports.StudentDomainObjectMockInvalid = StudentDomainObjectMockInvalid;