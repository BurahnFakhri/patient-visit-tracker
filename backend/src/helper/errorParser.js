const errorParser = (error) => {
    let validationErrors = '';
    let responseCode = 500;
    // let responseCode = 200;
    //ToDo
    if (error.name === 'SequelizeUniqueConstraintError') {
        const uniqueFields = {};
        const errorMessages = error.errors.map(err => err.message).join(', ');
        return { error: errorMessages, responseCode };
    } else if (error.name === 'SequelizeValidationError') {
        const errorMessages = error.errors.map(err => err.message);
        return {error:errorMessages.join(','), responseCode};
    }
    else {
        try {
            validationErrors = error.toString().replace('Error ','');  
        } catch (e) {
            validationErrors = 'Internal Server Error';
        }
    }
    validationErrors = validationErrors.replace('Error: ','');
    return {error:validationErrors, responseCode}    
}
module.exports = errorParser;  