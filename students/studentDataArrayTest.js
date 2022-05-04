var Test = require('../framework/test')


class StudentDataArrayTest {

    static runTests() {
        StudentDataArrayTest.TestNumberOfStudents();
        StudentDataArrayTest.TestGetRandomGPA();
    }

    static TestNumberOfStudents() {

        Test.it('Student Data Array Test - 1', 'should have 14 students', function() {
            var StudentDataArray = require('./studentDataArray');
            var studentDataArray = new StudentDataArray();
            
            let students = studentDataArray.getAllStudents();
            Test.assert(students.length == 14);    
        });

    }

    static TestGetRandomGPA() {

        Test.it('Student Data Array Test - 2', 'should return a random GPA', function() {
            var StudentDataArray = require('./studentDataArray');
            var studentDataArray = new StudentDataArray();
            
            //It is unlikely, but possible for the same GPA to be 
            //chosen twice, but even more unlikely the same will be 
            //returned three times.
            let GPA1 = studentDataArray.getRandomGPA();
            let GPA2 = studentDataArray.getRandomGPA();
            let GPA3 = studentDataArray.getRandomGPA();

            Test.assert((GPA1 != GPA2) || (GPA2 != GPA3) || (GPA1 != GPA3), 
                'RandomGPA is returning the same value')
        });

    }

}

module.exports = StudentDataArrayTest;