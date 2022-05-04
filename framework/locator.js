
class Locator {

    static services = [];

    constructor(){}

    register(key, service) {
        Locator.services[key] = service;
        //console.log("Register " + key);
    }

    resolve(key) {
        //console.log("Resolve " + key);
        return Locator.services[key];
    };
    
    clear() {
        Locator.services = [];
    }
}


module.exports = Locator;