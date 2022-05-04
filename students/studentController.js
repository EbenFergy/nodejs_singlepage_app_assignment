var ControllerBase = require("../framework/controllerBase");

class StudentController extends ControllerBase {
    static get baseObject() {return 'student';}

    // Display list of all students.
    static GetStudents (req, res) {
        super.baseObject = StudentController.baseObject;
        super.GetItems(req, res);
    };

    // Display detail page for a specific student.
    static GetStudent(req, res) {
        super.baseObject = StudentController.baseObject;
        super.GetItem(req, res);
    }

    // Delete a specific student.
    static DeleteStudent(req, res) {
        super.baseObject = StudentController.baseObject;
        super.DeleteItem(req, res);
    };

    // Handle student create on POST.
    static CreateStudent(req, res) {
        super.baseObject = StudentController.baseObject;
        super.CreateItem(req, res);
    };

    //Handle student update on POST
    static UpdateStudent(req, res) {
        super.baseObject = StudentController.baseObject;
        super.UpdateItem(req, res);
     }


 }


module.exports = StudentController;
