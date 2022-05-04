class Test {

    static it(testnumber, description, funct) {
        try{
            console.log();
            console.log(`Running Test ${testnumber} ------------------------------------------------`)
            funct();
            console.log('Success - ' + description);
            console.log();
        } catch (error) {
            console.log('Failed - ' + description + ' - ' + error);
            console.log();
        }
    }

    static assert(isTrue, message) {
        if (!isTrue) {
            throw new Error(message);
        }
    }

}

module.exports = Test;