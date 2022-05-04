class StudentDataAccessMockValid {

	//return all students
	getAllStudents() {
		return 	[{ id: 1, name: 'Person 1', class: 'Junior', major: 'Biology' },
                 { id: 2, name: 'Person 2', class: 'Senior', major: 'Chemistry' }];
	}

	getStudents(request) {
        let response = {};
        response.data = this.getAllStudents();
        response.totalRecords = response.data.length;
        return response;
	}


	//return the student with the specific id
	getStudentById(studentId) {
        return { id: studentId, name: 'Person 1', class: 'Junior', major: 'Biology' }
	}

	//delete the student with the specific id
	deleteStudentById(studentId) {
        return { id: studentId, name: 'Person 1', class: 'Junior', major: 'Biology' }
	}
	
	createStudent(student){
		return {id: 1, name: 'Person 1', class: 'Junior', major: 'Biology', gpa: 3.22};
    }

	updateStudent(studentId, student){
		return {id: 1, name: 'Person 1', class: 'Junior', major: 'Biology', gpa: 3.22};
	}
}

class StudentDataAccessMockInvalid {

	//return all students
	getAllStudents() {
        throw new Error('Failure in StudentDataAccess.getAllStudents()');
    }

	getStudents(request) {
        throw new Error('Failure in StudentDataAccess.getStudents()');
	}

	//return the student with the specific id
	getStudentById(studentId) {
        throw new Error('Failure in StudentDataAccess.getStudentsById()');
	}

	//delete the student with the specific id
	deleteStudentById(studentId) {
        throw new Error('Failure in StudentDataAccess.deleteStudentsById()');
	}
	
	createStudent(student){
        throw new Error('Failure in StudentDataAccess.createStudent()');
    }

	updateStudent(studentId, student){
        throw new Error('Failure in StudentDataAccess.updateStudent()');
	}
}

module.exports.StudentDataAccessMockValid = StudentDataAccessMockValid;
module.exports.StudentDataAccessMockInvalid = StudentDataAccessMockInvalid;

