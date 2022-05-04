var Request = require('../framework/request')

class ProfessorRequest extends Request{
    constructor(req) {
        super(req);
		this.initializeProfessorRequest(req);
	}

    initializeProfessorRequest(req) {
        if (this.isGet()) {
            this.readFilterParameters(req.query);
        }
    }

	readFilterParameters(query) {
        this.filterParameters = {};

        if (!query) return;

        if (query.title)
            this.filterParameters.title = query.title;
        if (query.department)
            this.filterParameters.department = query.department;
        if (query.namesearch)
            this.filterParameters.nameSearch = query.namesearch;
	
	}



}

module.exports = ProfessorRequest;