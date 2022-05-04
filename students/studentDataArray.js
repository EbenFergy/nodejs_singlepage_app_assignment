var Error = require("../framework/errors");

//Typically the model will access a database of some type, but this is omitted in this example for simplicity


class StudentDataArray {

	constructor() {

		if (StudentDataArray.instance)
			return StudentDataArray.instance;
		
		this.initialize();

		StudentDataArray.instance = this;
	}

	//initialize the studentList with students
	initialize() {
		this.studentList = 
			[
				{ id: 1, name: 'Chris Gammill', class: 'Junior', major: 'Engineering', gpa: 3.20 },
				{ id: 2, name: 'Amy Zion', class: 'Junior', major: 'Computer Science', gpa: 3.36 },
				{ id: 3, name: 'Kenneth Findley', class: 'Senior', major: 'Computer Science', gpa: 2.81 },
				{ id: 4, name: 'Jason Kastounis', class: 'Senior', major: 'Computer Science', gpa: 3.12},	
				{ id: 5, name: 'Adrian Goodchild', class: 'Sophmore', major: 'Art', gpa: 2.34 },
				{ id: 6, name: 'Dave Payne', class: 'Freshman', major: 'Biology', gpa: 3.22 },
				{ id: 7, name: 'Amy Gregory', class: 'Freshman', major: 'Biology', gpa: 3.45 },
				{ id: 8, name: 'Kristi Schaffer', class: 'Senior', major: 'Engineering', gpa: 3.00 },	
				{ id: 9, name: 'Kaitlun Peterson', class: 'Sophmore', major: 'Engineering', gpa: 3.88 },
				{ id: 10, name: 'Brad Hammond', class: 'Sophmore', major: 'Engineering', gpa: 2.98 },
				{ id: 11, name: 'Dana Agapescu', class: 'Senior', major: 'Biology', gpa: 4.00 },
				{ id: 12, name: 'Stephan Olariu', class: 'Senior', major: 'Computer Science', gpa: 4.00 },	
				{ id: 13, name: 'Michele Weigle', class: 'Junior', major: 'Computer Science', gpa: 4.00 },
				{ id: 14, name: 'Adam du Pon', class: 'Freshman', major: 'Computer Science', gpa: 3.99 },
			];

		this.nextId = this.studentList.length;

	}

	reserveAndGetNextId() {
		this.nextId++;
		return this.nextId;
	}

	getRandomGPA() {
		let minGPA = 2.0;
		let maxGPA = 4.0;
		let decimalPoints = 2;

		//Get a random number between 200 and 400
		let maxRandom = (maxGPA * (10 ** decimalPoints));
		let minRandom = (minGPA * (10 ** decimalPoints));
		let rndNumber = Math.floor(Math.random() * (maxRandom - minRandom) + minRandom);

		//Divide the rndNumber by the number of decimal points.
		return rndNumber / (10 ** decimalPoints);

	}

	//return all students
	getAllStudents() {
		return this.studentList;
	}

	getStudents(request) {


		let studentsFiltered = this.getFilteredStudents(this.studentList, request.filterParameters);
		let studentsSorted = this.getSortedStudents(studentsFiltered, request.sortParameters);
		let studentsPaged = this.getPagedStudents(studentsSorted, request.pageParameters);


		let response = {}
		response.data = studentsPaged;
		//Contains the number of filtered and sorted records before paging.
		response.totalRecords = studentsFiltered.length;
		
		return response;
	}

	getFilteredStudents(students, filterParameters) {
		//if there are no filterParameters, skip this method
		if (!filterParameters)
			return students;
		
		//First filter by class, then filter my major
		if (filterParameters.class)
			students = students.filter(function(student){return student.class.toLowerCase() == filterParameters.class.toLowerCase()});
		if (filterParameters.major)
			students = students.filter(function(student){return student.major.toLowerCase() == filterParameters.major.toLowerCase()});
		if (filterParameters.gpaMin)
			students = students.filter(function(student){return Number(student.gpa) >= Number(filterParameters.gpaMin)});
		if (filterParameters.gpaMax)
			students = students.filter(function(student){return Number(student.gpa) <= Number(filterParameters.gpaMax)});


		//Search
		if (filterParameters.nameSearch)
			students = students.filter(function(student){return student.name.toLowerCase().includes(filterParameters.nameSearch.toLowerCase())});
			
		return students;
	}

	getSortedStudents(students, sortParameters) {
		//if there are no sortParameters, skip this method
		if (!sortParameters)
			return students;

		// Here I am creating a sort function to sort based on the values.
		// I am passing in the value of the array that I want to sort by; 
		// I can access that value by name using a[sortParameters.sortBy]
		// Suppose the following:
		//   let student = {name:'Ryan', major:'Computer Science'};
		//	 console.log(student['name']);
		//
		// This will return the value of the property 'name', which is 'Ryan'.
		if (sortParameters.sortOrder.toLowerCase() == 'desc')
			students = students.sort((a,b) => (a[sortParameters.sortBy] > b[sortParameters.sortBy]) ? -1 : ((b[sortParameters.sortBy] > a[sortParameters.sortBy]) ? 1 : 0));
		else 
			students = students.sort((a,b) => (a[sortParameters.sortBy] > b[sortParameters.sortBy]) ? 1 : ((b[sortParameters.sortBy] > a[sortParameters.sortBy]) ? -1 : 0));

		return students;
	}


	getPagedStudents(students, pageParameters) {
		// Assume the first page is page 1, not 0.
		let firstRecordOfPage = (pageParameters.page - 1) * pageParameters.pageSize;
		let lastRecordOfPage = pageParameters.page * pageParameters.pageSize
		//myArray.slice(param1, param2) 
		//  will return the subset of mySrray starting at param1 and ending at param2
		return students.slice(firstRecordOfPage, lastRecordOfPage);
    }

	//return the student with the specific id
	getStudentById(studentId) {

		let student = this.studentList.find(student => {
			return student.id == studentId;
		})

		if (!student)
			throw new Error.ValidationError(['No student with this id']);

		return student;
	}

	//delete the student with the specific id
	deleteStudentById(studentId) {
		//see if the student exists first, then delete
		let student = this.getStudentById(studentId);
		
		this.studentList = this.studentList.filter(function(student){return student.id != studentId});

		return student;
	}
	
	createStudent(student){

		//Use the validatedStudent to set the newStudent
		let newStudent = {id: this.reserveAndGetNextId(), name: student.name, class: student.class, major: student.major, gpa: this.getRandomGPA()};
		this.studentList.push(newStudent);

		return newStudent;
	}

	updateStudent(studentId, newStudent){

		//Find the ExistingStudent
		let student = this.studentList.find(student => {
			return student.id == studentId;
		})

		if (!student)
			throw new Error.ValidationError(['No student with this id']);
		


		if (newStudent.name)
			student.name = newStudent.name;
		if (newStudent.class != null)
			student.class = newStudent.class;
		if (newStudent.major != null)
			student.major = newStudent.major;

		return student;
	}


}

module.exports = StudentDataArray;
