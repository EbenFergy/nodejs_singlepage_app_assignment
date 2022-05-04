const express = require('express')
const router = express.Router()

// Use Factory to get controller modules.
// var controllerFactory = require('../controllers/controllerFactory');

const Locator = require('../framework/locator');
const locator = new Locator();

const StudentController = locator.resolve('studentController');
const ProfessorController = locator.resolve('professorController');


/// STUDENT API ROUTES ///

// GET request for one student.
// GET api/students/1  - Get Student with id = 1
router.get('/students/:id', StudentController.GetStudent);

// GET request for list of all student items.
// GET api/students  - Get all students
router.get('/students', StudentController.GetStudents);

// POST request for creating student.
// POST api/students  - Create a new student
router.post('/students', StudentController.CreateStudent);

// POST request for updating student.
// POST api/students/1  - Update the student with id = 1
router.post('/students/:id', StudentController.UpdateStudent);

// Delete request for one student.
// DELETE /api/students/1 - Delete Student with id = 1
router.delete('/students/:id', StudentController.DeleteStudent);


/// PROFESSOR API ROUTES ///

// GET request for one professor.
// GET api/professors/1  - Get Professor with id = 1
router.get('/professors/:id', ProfessorController.GetProfessor);

// GET request for list of all professor items.
// GET api/professors  - Get all professors
router.get('/professors', ProfessorController.GetProfessors);

// POST request for creating professor.
// POST api/professors  - Create a new professor
router.post('/professors', ProfessorController.CreateProfessor);

// POST request for updating professor.
// POST api/professors/1  - Update the professor with id = 1
router.post('/professors/:id', ProfessorController.UpdateProfessor);

// Delete request for one professor.
// DELETE /api/professors/1 - Delete Professor with id = 1
router.delete('/professors/:id', ProfessorController.DeleteProfessor);


module.exports = router;
