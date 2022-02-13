var express = require('express');
var router = express.Router();


// Require controller modules.
var student_controller = require('../controllers/studentController');


/// STUDENT API ROUTES ///

// GET request for one student.
// GET api/student/1  - Get Student with id = 1
router.get('/student/:id', student_controller.student_detail);

// GET request for list of all student items.
// GET api/students  - Get all students
router.get('/students', student_controller.student_list);


// Delete request for one student.
// DELETE api/student/1  - Delete Student with id = 1
router.delete('/student/:id', student_controller.student_delete);

// POST request for creating student.
router.post('/student/create/:id/:name/:class/:major', student_controller.student_create_post);

// POST request to update student.
router.post('/student/:id/update/:name/:class/:major', student_controller.student_update_post);

/*



// GET request to delete student.
router.get('/student/:id/delete', student_controller.student_delete_get);

// POST request to delete student.
router.post('/student/:id/delete', student_controller.student_delete_post);

// GET request to update student.
router.get('/student/:id/update', student_controller.student_update_get);




*/





module.exports = router;