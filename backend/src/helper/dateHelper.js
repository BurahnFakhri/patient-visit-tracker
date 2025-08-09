
const dateHelper = {};

dateHelper.getMonthDiffBetweenDate = (fromDate, toDate) => {
    var months;
    months = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
    months -= fromDate.getMonth();
    months += toDate.getMonth();
    return months;
}

dateHelper.convertDateFormat = (dateString) => {
    // Split the date string by "/"
    var parts = dateString.split('/');
    
    // Rearrange the parts to the format "YYYY-MM-DD"
    var rearrangedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
    
    return rearrangedDate;
}

dateHelper.to12Hour = (time24) => {
  const [hour, minute] = time24.split(':').map(Number);
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // 0 → 12, 13 → 1

  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

module.exports = dateHelper;