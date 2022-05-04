var Response = require('../framework/response')

class StudentResponse extends Response{
    constructor(res) {
        super(res);
	}

    setParameters(totalRecords, sortParameters, pageParameters, filterParameters) {

        let totalPages = Math.ceil(totalRecords / pageParameters.pageSize);
        this.pageParameters = {currentpage:pageParameters.page, pagesize:pageParameters.pageSize, totalpages:totalPages, totalrecords:totalRecords};
        this.sortParameters = {sortby:sortParameters.sortBy, sortorder:sortParameters.sortOrder};
		this.filterParameters = {class:filterParameters.class, major:filterParameters.major, namesearch: filterParameters.nameSearch, gpamin: filterParameters.gpaMin, gpamax: filterParameters.gpaMax};

    }

    buildResponse() {
        if (this.success) {
            this.response = {success: true, data: this.data}

            if (this.sortParameters)
                this.response.sortparameters = this.sortParameters;
            if (this.pageParameters)
                this.response.pageparameters = this.pageParameters;
            if (this.filterParameters)
                this.response.filterparameters = this.filterParameters;
        }
        else
            this.response = {success: false, errorMessages: this.errorMessages}
    }


}

module.exports = StudentResponse;