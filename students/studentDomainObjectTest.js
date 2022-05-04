var Test = require('../framework/test')

var Locator = require("../framework/locator");
var locator = new Locator();


class StudentDomainObjectTest {

    static runTests() {
        StudentDomainObjectTest.TestValidationPositive1();
        StudentDomainObjectTest.TestValidationPositive2();
        StudentDomainObjectTest.TestValidationNegative1();
        StudentDomainObjectTest.TestValidationNegative2();
        StudentDomainObjectTest.TestValidationNegative3();
        StudentDomainObjectTest.TestValidationNegative4();
    }

    static TestValidationPositive1() {
        Test.it('Student Domain Object Test - 1', 'should allow me to add a Senior with a Major on insert', function() {
            locator.clear();
            var StudentDomainObject = require('./studentDomainObject');
             
            let req = {body:{name: 'Ryan Florin', class: 'Senior', major: 'Computer Science' }};
        
            try {
                let studentDomainObject = new StudentDomainObject(req.body, true);

                Test.assert(studentDomainObject.studentObject.name == 'Ryan Florin', 'Name is not correct');
                Test.assert(studentDomainObject.studentObject.class == 'Senior', 'Class is not correct');
                Test.assert(studentDomainObject.studentObject.major == 'Computer Science', 'Major is not correct');
                Test.assert(studentDomainObject.valid == true, 'Valid should be true');
                Test.assert(studentDomainObject.errorMessages.length == 0, 'Expected zero errorMessages');

            } catch (ex) {
                Test.assert(false, 'No exceptions should have been thrown.')
            }
        });
    }

    static TestValidationPositive2() {
        Test.it('Student Domain Object Test - 2', 'should allow me to add a student with only a name', function() {
            locator.clear();
            var StudentDomainObject = require('./studentDomainObject');
             
            let req = {body:{name: 'Ryan Florin', class: '', major: '' }};
        
            try {
                let studentDomainObject = new StudentDomainObject(req.body, true);
                Test.assert(studentDomainObject.studentObject.name == 'Ryan Florin', 'Name is not correct');
                Test.assert(studentDomainObject.studentObject.class == '', 'Class is not correct');
                Test.assert(studentDomainObject.studentObject.major == '', 'Major is not correct');
                Test.assert(studentDomainObject.valid == true, 'Valid should be true');
                Test.assert(studentDomainObject.errorMessages.length == 0, 'Expected zero errorMessages');
            } catch (ex) {
                Test.assert(false, 'No exceptions should have been thrown.')
            }
        });
    }

    static TestValidationNegative1() {
        Test.it('Student Domain Object Test - 3', 'should not allow me to add a Senior without a Major on insert', function() {
            locator.clear();
            var StudentDomainObject = require('./studentDomainObject');
             
            let req = {body:{name: 'Ryan Florin', class: 'Senior', major: '' }};
        
            try {
                let studentDomainObject = new StudentDomainObject(req.body, true);
                Test.assert(false, 'An error should have been thrown.')
            } catch (ex) {
                Test.assert(ex.validations[0] === 'Senior students must have a declared Major');    
            }
        });
    }

    static TestValidationNegative2() {
        Test.it('Student Domain Object Test - 4', 'should not allow me to add a Student without a name on insert', function() {
            locator.clear();
            var StudentDomainObject = require('./studentDomainObject');
            
            let req = {body:{name: '', class: 'Freshman', major: 'Computer Science' }};
        
            try {
                let studentDomainObject = new StudentDomainObject(req.body, true);
                Test.assert(false, 'An error should have been thrown.')
            } catch (ex) {
                Test.assert(ex.validations[0] === 'name field is required');    
            }
        });
    }

    static TestValidationNegative3() {
    
        Test.it('Student Domain Object Test - 5', 'should not allow me to add a Senior without a Major on update', function() {
            locator.clear();
            var StudentDomainObject = require('./studentDomainObject');
            
            let req = {body:{name: 'Ryan Florin', class: 'Senior', major: '' }};
        
            try {
                let studentDomainObject = new StudentDomainObject(req.body, false);
                Test.assert(false, 'An error should have been thrown.')
            } catch (ex) {
                Test.assert(ex.validations[0] === 'Senior students must have a declared Major');   
            }
        });
    }

    static TestValidationNegative4() {
    
        Test.it('Student Domain Object Test - 6', 'should not allow me to add a Student without a name on update', function() {
            locator.clear();
            var StudentDomainObject = require('./studentDomainObject');
            
            let req = {body:{name: '', class: 'Freshman', major: 'Computer Science' }};
        
            try {
                let studentDomainObject = new StudentDomainObject(req.body, false);
                Test.assert(false, 'An error should have been thrown.')
            } catch (ex) {
                Test.assert(ex.validations[0] === 'name field is required');    
            }
        });
    }

}

module.exports = StudentDomainObjectTest;