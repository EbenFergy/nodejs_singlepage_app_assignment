var Error = require("../framework/errors");

//Typically the model will access a database of some type, but this is omitted in this example for simplicity
class ProfessorDataArray {
  constructor() {
    if (ProfessorDataArray.instance) return ProfessorDataArray.instance;

    this.initialize();

    ProfessorDataArray.instance = this;
  }

  //initialize the professorList with professors
  initialize() {
    this.professorList = [
      {
        id: 1,
        name: "Ryan Florin",
        title: "Assistant Professor",
        department: "Computer Science",
      },
      {
        id: 2,
        name: "John Repko",
        title: "Visiting Professor",
        department: "Computer Science",
      },
      {
        id: 3,
        name: "Andrew Allen",
        title: "Associate Professor",
        department: "Computer Science",
      },
      {
        id: 4,
        name: "Lixin Li",
        title: "Professor",
        department: "Computer Science",
      },
      {
        id: 5,
        name: "Yao Xu",
        title: "Assistant Professor",
        department: "Computer Science",
      },
      {
        id: 6,
        name: "Adam Du Pon",
        title: "Assistant Professor",
        department: "Accounting",
      },
      {
        id: 7,
        name: "Paul Sobaje",
        title: "Assistant Professor",
        department: "Mathematics",
      },
      {
        id: 8,
        name: "Drew Snelling",
        title: "Assistant Professor",
        department: "Manufacturing Engineering",
      },
      {
        id: 9,
        name: "Saman Hedjazi",
        title: "Assistant Professor",
        department: "Civil Engineering",
      },
      {
        id: 10,
        name: "Murali Medidi",
        title: "Professor",
        department: "Computer Science",
      },
    ];

    this.nextId = this.professorList.length;
  }

  reserveAndGetNextId() {
    this.nextId++;
    return this.nextId;
  }

  //return all professors
  getAllProfessors() {
    return this.professorList;
  }

  getProfessors(request) {
    let professorsFiltered = this.getFilteredProfessors(
      this.professorList,
      request.filterParameters
    );
    let professorsSorted = this.getSortedProfessors(
      professorsFiltered,
      request.sortParameters
    );
    let professorsPaged = this.getPagedProfessors(
      professorsSorted,
      request.pageParameters
    );

    let response = {};
    response.data = professorsPaged;
    //Contains the number of filtered and sorted records before paging.
    response.totalRecords = professorsFiltered.length;

    return response;
  }

  getFilteredProfessors(professors, filterParameters) {
    //if there are no filterParameters, skip this method
    if (!filterParameters) return professors;

    //First filter by class, then filter my major
    if (filterParameters.title)
      professors = professors.filter(function (professor) {
        return (
          professor.title.toLowerCase() == filterParameters.title.toLowerCase()
        );
      });
    if (filterParameters.department)
      professors = professors.filter(function (professor) {
        return (
          professor.department.toLowerCase() ==
          filterParameters.department.toLowerCase()
        );
      });

    //Search
    if (filterParameters.nameSearch)
      professors = professors.filter(function (professor) {
        return professor.name
          .toLowerCase()
          .includes(filterParameters.nameSearch.toLowerCase());
      });

    return professors;
  }

  getSortedProfessors(professors, sortParameters) {
    //if there are no sortParameters, skip this method
    if (!sortParameters) return professors;

    // Here I am creating a sort function to sort based on the values.
    // I am passing in the value of the array that I want to sort by;
    // I can access that value by name using a[sortParameters.sortBy]
    // Suppose the following:
    //   let professor = {name:'Ryan', major:'Computer Science'};
    //	 console.log(professor['name']);
    //
    // This will return the value of the property 'name', which is 'Ryan'.
    if (sortParameters.sortOrder.toLowerCase() == "desc")
      professors = professors.sort((a, b) =>
        a[sortParameters.sortBy] > b[sortParameters.sortBy]
          ? -1
          : b[sortParameters.sortBy] > a[sortParameters.sortBy]
          ? 1
          : 0
      );
    else
      professors = professors.sort((a, b) =>
        a[sortParameters.sortBy] > b[sortParameters.sortBy]
          ? 1
          : b[sortParameters.sortBy] > a[sortParameters.sortBy]
          ? -1
          : 0
      );

    return professors;
  }

  getPagedProfessors(professors, pageParameters) {
    // Assume the first page is page 1, not 0.
    let firstRecordOfPage = (pageParameters.page - 1) * pageParameters.pageSize;
    let lastRecordOfPage = pageParameters.page * pageParameters.pageSize;
    //myArray.slice(param1, param2)
    //  will return the subset of mySrray starting at param1 and ending at param2
    return professors.slice(firstRecordOfPage, lastRecordOfPage);
  }

  //return the professor with the specific id
  getProfessorById(professorId) {
    let professor = this.professorList.find((professor) => {
      return professor.id == professorId;
    });

    if (!professor)
      throw new Error.ValidationError(["No professor with this id"]);

    return professor;
  }

  //delete the professor with the specific id
  deleteProfessorById(professorId) {
    //see if the professor exists first, then delete
    let professor = this.getProfessorById(professorId);

    this.professorList = this.professorList.filter(function (professor) {
      return professor.id != professorId;
    });

    return professor;
  }

  createProfessor(professor) {
    //Use the validatedProfessor to set the newProfessor
    let newProfessor = {
      id: this.reserveAndGetNextId(),
      name: professor.name,
      title: professor.title,
      department: professor.department,
    };
    this.professorList.push(newProfessor);

    return newProfessor;
  }

  updateProfessor(professorId, newProfessor) {
    //Find the ExistingProfessor
    let professor = this.professorList.find((professor) => {
      return professor.id == professorId;
    });

    if (!professor)
      throw new Error.ValidationError(["No professor with this id"]);

    if (newProfessor.name) professor.name = newProfessor.name;
    if (newProfessor.title != null) professor.title = newProfessor.title;
    if (newProfessor.department != null)
      professor.department = newProfessor.department;

    return professor;
  }
}

module.exports = ProfessorDataArray;
