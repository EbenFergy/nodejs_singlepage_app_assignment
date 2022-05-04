var express = require("express");

//get Locator service
var Locator = require("./framework/locator");
var locator = new Locator();

// Register services in reverse dependency order
// Student Dependencies
var StudentRequest = require("./students/studentRequest");
locator.register("studentRequest", StudentRequest);

var StudentResponse = require("./students/studentResponse");
locator.register("studentResponse", StudentResponse);

var StudentDataAccess = require("./students/studentDataArray");
locator.register("studentDataAccess", StudentDataAccess);

var StudentDomainObject = require("./students/studentDomainObject");
locator.register("studentDomainObject", StudentDomainObject);

var StudentModel = require("./students/studentModel");
locator.register("studentModel", StudentModel);

var StudentController = require("./students/studentController");
locator.register("studentController", StudentController);

// Professor Dependencies
var ProfessorRequest = require("./professors/professorRequest");
locator.register("professorRequest", ProfessorRequest);

var ProfessorResponse = require("./professors/professorResponse");
locator.register("professorResponse", ProfessorResponse);

var ProfessorDataAccess = require("./professors/professorDataArray");
locator.register("professorDataAccess", ProfessorDataAccess);

var ProfessorDomainObject = require("./professors/professorDomainObject");
locator.register("professorDomainObject", ProfessorDomainObject);

var ProfessorModel = require("./professors/professorModel");
locator.register("professorModel", ProfessorModel);

var ProfessorController = require("./professors/professorController");
locator.register("professorController", ProfessorController);

//Handle Express and Routing
var publicRouter = require("./routes/public");
var apiRouter = require("./routes/api");

var app = express();

app.use(express.json());

//Setup router for the api
app.use("/api", apiRouter);
//Setup router for the public files
app.use("/", publicRouter);

//Create Server
const PORT = process.env.PORT || 3050;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));

module.exports = app;
