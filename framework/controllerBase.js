var Locator = require("../framework/locator");
var locator = new Locator();
var Error = require("../framework/errors");

class ControllerBase {

    static get baseObject() {return ControllerBase._object;}
    static set baseObject(value) {ControllerBase._object = value;}

    static get Request() { return locator.resolve(ControllerBase._object + 'Request'); }
    static get Response() { return locator.resolve(ControllerBase._object + 'Response'); }
    static get Model() { return locator.resolve(ControllerBase._object + 'Model'); }
    static get DomainObject() { return locator.resolve(ControllerBase._object + 'DomainObject'); }


    // Display list of all items.
    static GetItems (req, res) {

        try {
            //Initialize the Request
            let request = new ControllerBase.Request(req);    

            //Perform the Action
            var Model = new ControllerBase.Model();
            let Data = Model.getItems(request);

            //Initialize and handle the Response
            let response = new ControllerBase.Response(res);
            response.setParameters(Data.totalRecords, request.sortParameters, 
                                    request.pageParameters, request.filterParameters);
            response.data = Data.data;
            response.send();
        } catch (ex) { 
            ControllerBase.HandleException(res, ex);
        }
    };


    // Display detail page for a specific item.
    static GetItem(req, res) {
        try{       

            //Initialize the Request
            let request = new ControllerBase.Request(req);
                
            //Perform the Action
            var Model = new ControllerBase.Model();
            let Data = Model.getItemsById(request.id);

            //Initialize and handle the Response
            let response = new ControllerBase.Response(res);
            response.data = Data;
            response.send();
        } catch (ex) { 
            ControllerBase.HandleException(res, ex);
        }
    }

    // Delete a specific item.
    static DeleteItem(req, res) {
        try{       
            //Initialize the Request
            let request = new ControllerBase.Request(req);
                
            //Perform the Action
            var Model = new ControllerBase.Model();
            let Data = Model.deleteItemById(request.id);

            //Initialize and handle the Response
            let response = new ControllerBase.Response(res);
            response.data = Data;
            response.send();
        } catch (ex) { 
            ControllerBase.HandleException(res, ex);
        }
    };

    // Handle item create on POST.
    static CreateItem(req, res) {

        try{
            //Initialize the Request
            let request = new ControllerBase.Request(req);

            //Perform the Action
            //Use the DomainObject to validate the item
            let isInsert = true;
            let Object = new ControllerBase.DomainObject(request.body, isInsert);
            var Model = new ControllerBase.Model();
            let item = Model.createItem(Object);

            //Initialize and handle the Response
            let response = new ControllerBase.Response(res);
            response.data = item;
            response.status = 201;
            response.send();

        } catch (ex) { 
            ControllerBase.HandleException(res, ex);
        }

    };

    //Handle item update on POST
    static UpdateItem(req, res) {

        try{
            //Initialize the Request
            let request = new ControllerBase.Request(req);
           
            //Perform the Action
            //Use the DomainObject to validate the item
            let isInsert = false;
            let Object = new ControllerBase.DomainObject(request.body, isInsert);
            var Model = new ControllerBase.Model();
            let item = Model.updateItem(request.id, Object);

            //Initialize and handle the Response
            let response = new ControllerBase.Response(res);
            response.data = item;
            response.send();

        } catch (ex) { 
            ControllerBase.HandleException(res, ex);
        }

    }

    static HandleException(res, ex) {
        let response = new ControllerBase.Response(res);

        if (ex instanceof Error.ValidationError) {
            response.handleError(ex.validations);
        } else {
            response.handleError(ex.message);
        }
    }

}


module.exports = ControllerBase;
