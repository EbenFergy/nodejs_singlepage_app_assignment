var Locator = require("../framework/locator");
var locator = new Locator();

class StudentModel {
	constructor() {
		var StudentDataAccess = locator.resolve('studentDataAccess');
		this.studentDataAccess = new StudentDataAccess();
	}
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


	getStudents(request) {
		return this.studentDataAccess.getStudents(request);
	}

	//return the student with the specific id
	getStudentById(studentId) {
		return this.studentDataAccess.getStudentById(studentId);
	}

	//delete the student with the specific id
	deleteStudentById(studentId) {
		let deletedStudent = this.studentDataAccess.deleteStudentById(studentId);
		return deletedStudent;
	}
	
	createStudent(studentDomainObject){
		//Get the validatedStudent
		let validatedStudent = studentDomainObject.student();

		let newStudent = this.studentDataAccess.createStudent(validatedStudent);

		return newStudent;
	}

	updateStudent(studentId, studentDomainObject){
		//Get the validatedStudent
		let validatedStudent = studentDomainObject.student();

		let student = this.studentDataAccess.updateStudent(studentId, validatedStudent);

		return student;
	}


	
}

module.exports = StudentModel;
