
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export const getDates = (f_date, t_date) => {
    var dateArray = new Array();
    var currentDate = f_date;
    while (currentDate <= t_date) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

export const getColor = (post) => {
    let color;
    post.validate ? color="green" : color="red";
    return color;
}