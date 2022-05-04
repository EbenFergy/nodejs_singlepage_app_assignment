class Request {

    isGet() { return this.method == 'GET'}
    isPost() { return this.method == 'POST'}
    isDelete() { return this.method == 'DELETE'}

    constructor(req) {
        this.initializeRequest(req);
        this.validate();
	}


    initializeRequest(req) {
        this.method = req.method;

        this.readBody(req.body);
        this.readQuery(req.query);
        if (req.url) this.url = req.url;
        this.readURLParameters(req.params);

    }

    readBody(body){
        this.body = body;
    }

    readQuery(query){
        this.query = query;

        if (this.isGet()) { 
            this.readPageParameters(query);
            this.readSortParameters(query);
        }
    }

    readPageParameters(query) {

        //Default the paging to page 1, size 10
        this.pageParameters = {page:1, pageSize:10};
        if (!query) return;

        if (query.page)
            this.pageParameters.page = query.page;
        if (query.pagesize)
            this.pageParameters.pageSize = query.pagesize;
	}


    readSortParameters(query) {

        //Sorting is defaulted to true, sort by id ASC.
        this.sortParameters = {sortBy: 'id', sortOrder: 'asc'};

        if (!query) return;

        if (query.sortby)
            this.sortParameters.sortBy = query.sortby;
        if (query.sortorder)
            this.sortParameters.sortOrder = query.sortorder;
	}


    readURLParameters(params) {
        this.params = params;

        if (!params)
            return;

        if (params.id)
            this.id = params.id;
    }

    validate(){
        if (this.isPost())
            return this.validatePOST();
    }

    validatePOST() {
        let valid = true;
        let errorMessages = [];

        if (!this.body) {
            valid = false;
            errorMessages.push('request body is missing'); 
        }

        if (!valid)
            throw new Error.ValidationError(errorMessages);

    }
}

module.exports = Request;