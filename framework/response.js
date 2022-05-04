class Response {

    constructor(res) {
		this.initializeResponse(res);
	}

    initializeResponse(res) {
        this.res = res;
        this.success = true;
        this.status = 200;
        this.errorMessages = [];
        this.data = {};
    }

    buildResponse() {
        if (this.success)
            this.response = {success: true, data: this.data}
        else
            this.response = {success: false, errorMessages: this.errorMessages}
    }

    send(){
        this.buildResponse();
        this.res.status(this.status);
        this.res.send(this.response);
    }

    handleError(ex) {
        console.log(ex);
        this.success = false;
        this.status = 400;
        this.errorMessages.push(ex);
        this.send();
    }
}

module.exports = Response;