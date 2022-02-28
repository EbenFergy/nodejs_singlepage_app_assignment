var StudentDomainObject = require("../domainObject/student");
studentObject = new StudentDomainObject();
var ResponseHelper = require("./responseHelper");

//Typically the model will access a database of some type, but this is omitted in this example for simplicity
class StudentModel {
  constructor() {
    this.initialize();
  }

  //initialize the studentList with students
  initialize() {
    this.studentList = [
      { id: 1, name: "Chris Gammill", class: "Junior", major: "Engineering" },
      { id: 2, name: "Amy Zion", class: "Junior", major: "Computer Science" },
      {
        id: 3,
        name: "Kenneth Findley",
        class: "Senior",
        major: "Computer Science",
      },
      {
        id: 4,
        name: "Jason Kastounis",
        class: "Senior",
        major: "Computer Science",
      },
      { id: 5, name: "Adrian Goodchild", class: "Sophomore", major: "Art" },
      { id: 6, name: "Dave Payne", class: "Freshman", major: "Biology" },
      { id: 7, name: "Amy Gregory", class: "Freshman", major: "Biology" },
      { id: 8, name: "Kristi Schaffer", class: "Senior", major: "Engineering" },
      {
        id: 9,
        name: "Kaitlun Peterson",
        class: "Sophomore",
        major: "Engineering",
      },

      { id: 10, name: "Brad Hammond", class: "Sophomore", major: "Engineering" },
      { id: 11, name: "Dana Agapescu", class: "Senior", major: "Biology" },
      {
        id: 12,
        name: "Stephan Olariu",
        class: "Senior",
        major: "Computer Science",
      },
      {
        id: 13,
        name: "Michele Weigle",
        class: "Junior",
        major: "Computer Science",
      },
      {
        id: 14,
        name: "Adam du Pon",
        class: "Freshman",
        major: "Computer Science",
      },
    ];

    this.nextId = this.studentList.length;
  }

  reserveAndGetNextId() {
    this.nextId++;
    return this.nextId;
  }

  //return all students
  getAllStudents() {
    return this.studentList;
  }

  getStudents(sortParameters, pageParameters, filterParameters) {
    //
    //Currently this method returns the complete list of students and ignores the sort,
    //page and filter parameters.
    //
    //This method needs to handle the sort, page, and filter, parameters properly.  Notice
    //there are methods for each below.
    //
    //The response should include the total number pages based on the filter and page parameters
    //so the paging control on the front end works properly. Note that this is currently
    //hardcoded to 5.

    let students = this.studentList;
    // console.log("page parameters at the backend", pageParameters);
    console.log("filter parameters at the backend", filterParameters);

    let studentsFiltered = this.getFilteredStudents(students, filterParameters);
    // console.log("getFiltered parameters at the backend", filterParameters);
    let studentsSorted = this.getSortedStudents(
      studentsFiltered,
      sortParameters
    );
    let pagedStudents = this.getPagedStudents(studentsSorted, pageParameters);
    // console.log("response to front end", pagedStudents);

    let response = ResponseHelper.createResponse(
      sortParameters,
      pageParameters,
      filterParameters
    );
    //The totalpages parameter is hard coded to 5, but this is incorrect.
    response.pageparameters.totalpages;

    if (studentsSorted.length % 4 === 0) {
      response.pageparameters.totalpages = studentsSorted.length / 4;
    } else if (studentsSorted.length % 4 === 1) {
      response.pageparameters.totalpages =
        Math.round(studentsSorted.length / 4) + 1;
    } else if (studentsSorted.length % 4 > 1) {
      response.pageparameters.totalpages = Math.round(
        studentsSorted.length / 4
      );
    }

    console.log("page size", response.pageparameters.totalpages);

    response.data = pagedStudents;

    return response;
  }

  getFilteredStudents(students, filterParameters) {
    console.log("students inside in getFilteredStudents", students);
    console.log("filter parameter in getFilteredStudents", filterParameters);
    //if there are no filterParameters, skip this method
    if (!filterParameters) return students;

    //First filter by class, then filter my major
    if (filterParameters.class)
      students = students.filter(function (student) {
        return (
          student.class.toLowerCase() == filterParameters.class.toLowerCase()
        );
      });
    if (filterParameters.major)
      students = students.filter(function (student) {
        return (
          student.major.toLowerCase() == filterParameters.major.toLowerCase()
        );
      });

    console.log("Output from filter", students);

    return students;
  }

  getSortedStudents(students, sortParameters) {
    //if there are no sortParameters, skip this method
    if (!sortParameters) return students;

    // Here I am creating a sort function to sort based on the values.
    // I am passing in the value of the array that I want to sort by;
    // I can access that value by name using a[sortParameters.sortBy]
    // Suppose the following:
    //   let student = {name:'Ryan', major:'Computer Science'};
    //	 console.log(student['name']);
    //
    // This will return the value of the property 'name', which is 'Ryan'.
    if (sortParameters.sortOrder.toLowerCase() == "desc")
      students = students.sort((a, b) =>
        a[sortParameters.sortBy] > b[sortParameters.sortBy]
          ? -1
          : b[sortParameters.sortBy] > a[sortParameters.sortBy]
          ? 1
          : 0
      );
    else
      students = students.sort((a, b) =>
        a[sortParameters.sortBy] > b[sortParameters.sortBy]
          ? 1
          : b[sortParameters.sortBy] > a[sortParameters.sortBy]
          ? -1
          : 0
      );
    console.log("output from sorting", students);
    return students;
  }

  getPagedStudents(students, pageParameters) {
    // console.log("students in the getPaged students", students);
    // Assume the first page is page 1, not 0.
    let firstRecordOfPage = (pageParameters.page - 1) * pageParameters.pageSize;
    let lastRecordOfPage = pageParameters.page * pageParameters.pageSize;
    //myArray.slice(param1, param2)
    //  will return the subset of mySrray starting at param1 and ending at param2
    console.log(
      "list of sliced students per page",
      students.slice(firstRecordOfPage, lastRecordOfPage)
    );
    return students.slice(firstRecordOfPage, lastRecordOfPage);
  }

  //return the student with the specific id
  getStudentById(sid) {
    let student = this.studentList.find((student) => {
      return student.id == sid;
    });

    if (!student) throw "No student with this id";

    return student;
  }

  //delete the student with the specific id
  deleteStudentById(studentId) {
    //see if the student exists first, then delete
    this.getStudentById(studentId);

    this.studentList = this.studentList.filter(function (student) {
      return student.id != studentId;
    });
  }

  createStudent(requestObject) {
    //Use the StudentDomainObject to validate the student
    let isInsert = true;
    let studentObject = new StudentDomainObject(requestObject, isInsert);
    if (studentObject.valid == false) throw studentObject.errorMessages;

    //Get the validatedStudent
    let validatedStudent = studentObject.student();

    //Use the validatedStudent to set the newStudent
    let newStudent = {
      id: this.reserveAndGetNextId(),
      name: validatedStudent.name,
      class: validatedStudent.class,
      major: validatedStudent.major,
    };
    this.studentList.push(newStudent);

    return newStudent;
  }

  updateStudent(sid, requestObject) {
    //Use the StudentDomainObject to validate the student
    let isInsert = false;
    let studentObject = new StudentDomainObject(requestObject, isInsert);
    if (studentObject.valid == false) throw studentObject.errorMessages;

    //Get the validatedStudent
    let validatedStudent = studentObject.student();

    //Find the ExistingStudent
    let student = this.studentList.find((student) => {
      return student.id == sid;
    });

    if (!student) throw "No student with this id";

    if (validatedStudent.name) student.name = validatedStudent.name;
    if (validatedStudent.class != null) student.class = validatedStudent.class;
    if (validatedStudent.major != null) student.major = validatedStudent.major;

    return student;
  }
}

module.exports = StudentModel;
