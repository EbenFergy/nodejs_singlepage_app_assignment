var Locator = require("../framework/locator");
var locator = new Locator();

class ProfessorModel {
	constructor() {
		var ProfessorDataAccess = locator.resolve('professorDataAccess');
		this.professorDataAccess = new ProfessorDataAccess();
	}

	getItems(request) {
		return this.getProfessors(request);
	}
	getItem(request) {
		return this.getProfessorById(request);
	}
	deleteItemById(id, request) {
		return this.deleteProfessorById(id, request);
	}
	createItem(request) {
		return this.createProfessor(request);
	}
	updateItem(id, request) {
		return this.updateProfessor(id, request);
	}

	getProfessors(request) {
		return this.professorDataAccess.getProfessors(request);
	}

	//return the professor with the specific id
	getProfessorById(professorId) {
		return this.professorDataAccess.getProfessorById(professorId);
	}

	//delete the professor with the specific id
	deleteProfessorById(professorId) {
		let deletedProfessor = this.professorDataAccess.deleteProfessorById(professorId);
		return deletedProfessor;
	}
	
	createProfessor(professorDomainObject){
		//Get the validatedProfessor
		let validatedProfessor = professorDomainObject.professor();

		let newProfessor = this.professorDataAccess.createProfessor(validatedProfessor);

		return newProfessor;
	}

	updateProfessor(professorId, professorDomainObject){
		//Get the validatedProfessor
		let validatedProfessor = professorDomainObject.professor();

		let professor = this.professorDataAccess.updateProfessor(professorId, validatedProfessor);

		return professor;
	}


}

module.exports = ProfessorModel;
