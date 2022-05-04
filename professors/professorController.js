var ControllerBase = require("../framework/controllerBase");

class ProfessorController extends ControllerBase {
    static get baseObject() {return 'professor';}

    // Display list of all professors.
    static GetProfessors (req, res) {
        super.baseObject = ProfessorController.baseObject;
        super.GetItems(req, res);
    };

    // Display detail page for a specific professor.
    static GetProfessor(req, res) {
        super.baseObject = ProfessorController.baseObject;
        super.GetItem(req, res);
    }

    // Delete a specific professor.
    static DeleteProfessor(req, res) {
        super.baseObject = ProfessorController.baseObject;
        super.DeleteItem(req, res);
    };

    // Handle professor create on POST.
    static CreateProfessor(req, res) {
        super.baseObject = ProfessorController.baseObject;
        super.CreateItem(req, res);
    };

    //Handle professor update on POST
    static UpdateProfessor(req, res) {
        super.baseObject = ProfessorController.baseObject;
        super.UpdateItem(req, res);
     }



     
}


module.exports = ProfessorController;
