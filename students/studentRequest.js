var Request = require('../framework/request')

class StudentRequest extends Request{
    constructor(req) {
        super(req);
		this.initializeStudentRequest(req);
	}

    initializeStudentRequest(req) {
        if (this.isGet()) {
            this.readFilterParameters(req.query);
        }
    }

	readFilterParameters(query) {
        this.filterParameters = {};

        if (!query) return;

        if (query.class)
            this.filterParameters.class = query.class;
        if (query.major)
            this.filterParameters.major = query.major;
        if (query.namesearch)
            this.filterParameters.nameSearch = query.namesearch;
        if (query.gpamin)
            this.filterParameters.gpaMin = query.gpamin;
        if (query.gpamin)
            this.filterParameters.gpaMax = query.gpamax;
	
	}



}

module.exports = StudentRequest;