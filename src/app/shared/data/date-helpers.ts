export const getYearsFilter = (fromYear) => {
    
    let currentYear = new Date().getFullYear();
    let years = [];

    for(let i = currentYear; i >= fromYear; i--) {
        years.push(i);
    }

    return years;
}

export const getCurrentWeekNumber = () => {
    
    let today = new Date();
    let firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    let pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / 86400000;

    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7) - 1;
}

export const getDateOfISOWeek = (week: number, year: number) => {
    let simple = new Date(year, 0, 1 + (week - 1) * 7);
    let dow = simple.getDay();
    let ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

export const getISOWeekNumber = (d) => {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = +new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
}