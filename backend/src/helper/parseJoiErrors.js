const parseJoiErrors = (joiErrorDetail,type=0) => {
  if(type) {
    const errors = {};
      joiErrorDetail.forEach((errorDetail) => {
          errors[errorDetail.context.key] = errorDetail.message.replace(/"/g, '');
        });
      return errors;
  } else {
    let errors = '';
      joiErrorDetail.forEach((errorDetail) => {
          errors+= errorDetail.message.replace(/"/g, '');
          errors+=". ";
        });
      return errors;
  } 
}

module.exports = parseJoiErrors;