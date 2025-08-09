const path = require('path');

const uploadFiles = async (fileData,directory,allowedTypes) => {
    const extname = path.extname(fileData.name).toLowerCase();
    if (!allowedTypes.includes(extname)) {
        throw new Error('Invalid file type. Only ' + allowedTypes.join(','))
    }
    const fileName = (Date.now() + '-' + Math.round(Math.random() * 1E9))+ extname
    uploadPath = 'public/'+ directory + fileName;
    await fileData.mv(uploadPath, function(err) {
        if (err) {
            throw new Error(err)
        }
    });
    return directory + fileName
}
module.exports = uploadFiles