class StudentModelMockValid {

	getItems(request) {
		return this.getStudents(request);
	}
	getItem(request) {
		return this.getStudentById(request);
	}
	deleteItemById(id, request) {
		return this.deleteStudentById(id, request);
	}
	createItem(request) {
		return this.createStudent(request);
	}
	updateItem(id, request) {
		return this.updateStudent(id, request);
	}

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
	
	createStudent(studentDomainObject){
		return {id: 1, name: 'Person 1', class: 'Junior', major: 'Biology', gpa: 3.22};
    }

	updateStudent(studentId, studentDomainObject){
		return {id: 1, name: 'Person 1', class: 'Junior', major: 'Biology', gpa: 3.22};
	}
}

class StudentModelMockInvalid {

	getItems(request) {
		return this.getStudents(request);
	}
	getItem(request) {
		return this.getStudentById(request);
	}
	deleteItemById(id, request) {
		return this.deleteStudentById(id, request);
	}
	createItem(request) {
		return this.createStudent(request);
	}
	updateItem(id, request) {
		return this.updateStudent(id, request);
	}
	
	//return all students
	getAllStudents() {
        throw new Error('Failure in StudentModel.getAllStudents()');
    }

	getStudents(request) {
        throw new Error('Failure in StudentModel.getStudents()');
	}

	//return the student with the specific id
	getStudentById(studentId) {
        throw new Error('Failure in StudentModel.getStudentsById()');
	}

	//delete the student with the specific id
	deleteStudentById(studentId) {
        throw new Error('Failure in StudentModel.deleteStudentsById()');
	}
	
	createStudent(studentDomainObject){
        throw new Error('Failure in StudentModel.createStudent()');
    }

	updateStudent(studentId, studentDomainObject){
        throw new Error('Failure in StudentModel.updateStudent()');
	}
}

module.exports.StudentModelMockValid = StudentModelMockValid;
module.exports.StudentModelMockInvalid = StudentModelMockInvalid;

