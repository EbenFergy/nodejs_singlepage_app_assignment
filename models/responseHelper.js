
class ResponseHelper {

	static createResponse(sortParameters, pageParameters, filterParameters) {

        return {data:{},
                pageparameters:{currentpage:pageParameters.page, pagesize:pageParameters.pageSize},
                sortparameters:{sortby:sortParameters.sortBy, sortorder:sortParameters.sortOrder},
                filterparameters:{class:filterParameters.class, major:filterParameters.major}};
	}
}

module.exports = ResponseHelper;