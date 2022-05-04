var Test = require('../framework/test')
var Locator = require("../framework/locator");
var locator = new Locator();

class StudentModelTest {

    static runTests() {
        StudentModelTest.TestGetStudentsSuccess();
        StudentModelTest.TestGetStudentsFailure();
/*
        StudentModelTest.TestGetStudentByIduccess();
        StudentModelTest.TestGetStudentByIdFailure();
        StudentModelTest.TestDeleteStudentSuccess();
        StudentModelTest.TestDeleteStudentFailure();
        StudentModelTest.TestCreateStudentSuccess();
        StudentModelTest.TestCreateStudentFailure();
        StudentModelTest.TestUpdateStudentSuccess();
        StudentModelTest.TestUpdateStudentFailure();
*/
    }

    static TestGetStudentsSuccess() {

        Test.it('Student Model - 1', 'should return students if data access is successful', function() {

            var StudentDataAccessMock = require('./mock/studentDataAccessMock');
            locator.register('studentDataAccess', StudentDataAccessMock.StudentDataAccessMockValid);
        
            var StudentModel = require('./studentModel');
            var studentModel = new StudentModel();

            var StudentRequest = require('../students/studentRequest');

            let req = {method: 'GET', params: {page: 1, pagesize: 1}};
            let request = new StudentRequest(req);

            try {
                let students = studentModel.getStudents(request);
                Test.assert(students.data.length > 0, 'Model did not return any students');    
            } catch(ex) {
               Test.assert(false, 'No errors were expected')
            }
        });

    }

    static TestGetStudentsFailure() {

        Test.it('Student Model - 2', 'should return failure if data access fails', function() {

            var StudentDataAccessMock = require('./mock/studentDataAccessMock');
            locator.register('studentDataAccess', StudentDataAccessMock.StudentDataAccessMockInvalid);
        
            var StudentModel = require('./studentModel');
            var studentModel = new StudentModel();

            var StudentRequest = require('../students/studentRequest');

            let req = {method: 'GET', params: {page: 1, pagesize: 1}};
            let request = new StudentRequest(req);

            try {
                let students = studentModel.getStudents(request);
                Test.assert(false, 'Data Access should have returned a failure');    
            } catch(ex) {
               Test.assert(ex.message == 'Failure in StudentDataAccess.getStudents()', 'Incorrect failure message returned');
            }
        });

    }


}

module.exports = StudentModelTest;