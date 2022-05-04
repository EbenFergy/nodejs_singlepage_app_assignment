var Test = require('../framework/test')

var Locator = require("../framework/locator");
var locator = new Locator();


class ExpressResponseMock {
    status(status) {
        this.status = status;
    }
    send(body) {
        this.body = body; 
    }
}

class StudentControllerTest {

    static runTests() {

        StudentControllerTest.TestGetStudentsSuccess();
        StudentControllerTest.TestGetStudentsFailureWhenStudentModelFails();
        

        StudentControllerTest.TestCreateStudentSuccess();
        StudentControllerTest.TestCreateStudentFailureWhenStudentDomainFails();
        StudentControllerTest.TestCreateStudentFailureWhenStudentModelFails();

    }


    static TestGetStudentsSuccess() {

            Test.it('Student Controller Test - 1', 'The controller should return proper success with no failures when getting students', function() {

            locator.clear();

            var StudentRequest = require('./studentRequest');
            locator.register('studentRequest', StudentRequest);

            var StudentResponse = require('.//studentResponse');
            locator.register('studentResponse', StudentResponse);

            var studentDomainObjectMock = require('./mock/studentDomainObjectMock');
            locator.register('studentDomainObject', studentDomainObjectMock.StudentDomainObjectMockValid);

            var StudentModelMock = require('./mock/studentModelMock');
            locator.register('studentModel', StudentModelMock.StudentModelMockValid);
        
            var StudentController = require('./studentController');
            
        
            let req = {method: 'GET', params:{page: 1, pagesize: 1}};
            let res = new ExpressResponseMock();
        
            StudentController.GetStudents(req, res);
                
            Test.assert(res.status == 200, 'response Status should be 200');
            Test.assert(res.body.success == true, 'body.success should be true');
            Test.assert(!res.body.errorMessages, 'body.errorMessage should not be set');
            Test.assert(res.body.data, 'body.data should be set');
        
        
        });
    }


    static TestGetStudentsFailureWhenStudentModelFails() {

        delete require.cache[require.resolve('./studentController')]

        Test.it('Student Controller Test - 2', 'The controller should return proper failure when the student domain model fails when getting students.', function() {

            locator.clear();
        
            var StudentRequest = require('./studentRequest');
            locator.register('studentRequest', StudentRequest);

            var StudentResponse = require('.//studentResponse');
            locator.register('studentResponse', StudentResponse);

            var studentDomainObjectMock = require('./mock/studentDomainObjectMock');
            locator.register('studentDomainObject', studentDomainObjectMock.StudentDomainObjectMockValid);
        
            var StudentModelMock = require('./mock/studentModelMock');
            locator.register('studentModel', StudentModelMock.StudentModelMockInvalid);
        
            var StudentController = require('./studentController');
            
            let req = {method: 'GET', params:{page: 1, pagesize: 1}};
            let res = new ExpressResponseMock();
        
            StudentController.GetStudents(req, res);
                
            Test.assert(res.status == 400, 'response Status should be 400');
            Test.assert(res.body.success == false, 'body.success should be false');
            Test.assert(res.body.errorMessages[0] == 'Failure in StudentModel.getStudents()', 'body.errorMessage should be "Failure in StudentModel.getStudents()" ');
        
        
        });

    }


    static TestCreateStudentSuccess() {

        delete require.cache[require.resolve('./studentController')]

        Test.it('Student Controller Test - 3', 'The controller should return proper success with no failures when creating students', function() {

            locator.clear();
        
            var StudentRequest = require('./studentRequest');
            locator.register('studentRequest', StudentRequest);

            var StudentResponse = require('.//studentResponse');
            locator.register('studentResponse', StudentResponse);

            var studentDomainObjectMock = require('./mock/studentDomainObjectMock');
            locator.register('studentDomainObject', studentDomainObjectMock.StudentDomainObjectMockValid);
        
            var StudentModelMock = require('./mock/studentModelMock');
            locator.register('studentModel', StudentModelMock.StudentModelMockValid);
        
            var StudentController = require('./studentController');
            
        
            let req = {body:{name: 'Ryan Florin', class: 'Senior', major: 'Computer Science' }};
            let res = new ExpressResponseMock();
        
            StudentController.CreateStudent(req, res);
                
            Test.assert(res.status == 201, 'response Status should be 201');
            Test.assert(res.body.success == true, 'body.success should be true');
            Test.assert(!res.body.errorMessages, 'body.errorMessage should not be set');
            Test.assert(res.body.data, 'body.data should be set');
        
        
        });

    }


    static TestCreateStudentFailureWhenStudentDomainFails() {

        delete require.cache[require.resolve('./studentController')]

        Test.it('Student Controller Test - 4', 'The controller should return proper failure when the student domain model fails when creating students.', function() {

            locator.clear();
        
            var StudentRequest = require('./studentRequest');
            locator.register('studentRequest', StudentRequest);

            var StudentResponse = require('.//studentResponse');
            locator.register('studentResponse', StudentResponse);

            var studentDomainObjectMock = require('./mock/studentDomainObjectMock');
            locator.register('studentDomainObject', studentDomainObjectMock.StudentDomainObjectMockInvalid);
        
            var StudentModelMock = require('./mock/studentModelMock');
            locator.register('studentModel', StudentModelMock.StudentModelMockValid);
        
            var StudentController = require('./studentController');
            
            let req = {body:{name: 'Ryan Florin', class: 'Senior', major: '' }};
            let res = new ExpressResponseMock();
        
            StudentController.CreateStudent(req, res);
                

            Test.assert(res.status == 400, 'response Status should be 400');
            Test.assert(res.body.success == false, 'body.success should be false');
            Test.assert(res.body.errorMessages[0] == 'Failure in StudentDomainModel.constructor', 'body.errorMessage should be "Failure in StudentDomainModel.constructor" ');
        
        
        });

    }

    static TestCreateStudentFailureWhenStudentModelFails() {

        delete require.cache[require.resolve('./studentController')]

        Test.it('Student Controller Test - 5', 'The controller should return proper failure when the student domain model fails when creating students.', function() {

            locator.clear();
        
            var StudentRequest = require('./studentRequest');
            locator.register('studentRequest', StudentRequest);

            var StudentResponse = require('.//studentResponse');
            locator.register('studentResponse', StudentResponse);

            var studentDomainObjectMock = require('./mock/studentDomainObjectMock');
            locator.register('studentDomainObject', studentDomainObjectMock.StudentDomainObjectMockValid);
        
            var StudentModelMock = require('./mock/studentModelMock');
            locator.register('studentModel', StudentModelMock.StudentModelMockInvalid);
        
            var StudentController = require('./studentController');
            
            let req = {body:{name: 'Ryan Florin', class: 'Senior', major: '' }};
            let res = new ExpressResponseMock();
        
            StudentController.CreateStudent(req, res);
                
            Test.assert(res.status == 400, 'response Status should be 400');
            Test.assert(res.body.success == false, 'body.success should be false');
            Test.assert(res.body.errorMessages[0] == 'Failure in StudentModel.createStudent()', 'body.errorMessage should be "Failure in StudentModel.createStudent()" ');
        
        
        });

    }

}

module.exports = StudentControllerTest;