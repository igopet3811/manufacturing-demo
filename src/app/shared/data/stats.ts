/* median */
export const median = arr => {
    const mid = Math.floor(arr.length / 2);
    const nums = [...arr].sort((a, b) => a - b);

    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

/* mean */
export const mean = arr => {
    return arr.reduce(function (a, b) {
        return Number(a) + Number(b);
    }) / arr.length;
}

/* standard deviation */
export const stdev = arr => {
    if(arr.length === 0) {
        return 0;
    }

    let m = mean(arr);
    return Math.sqrt(arr.reduce(function (sq, n) {
            return sq + Math.pow(n - m, 2);
        }, 0) / (arr.length - 1));
}

/* running average */
export const average = (arr, targetWpp) => {
    if(arr.length === 0) {
        return 0;
    }
    
    let sum = arr.reduce((previous, current) => current += previous);
    return  (sum/arr.length) / targetWpp;
}

/* running average */
export const avg = arr => {
    if(arr.length === 0) {
        return 0;
    }

    let sum = arr.reduce((previous, current) => current += previous);
    return  Math.round(sum/arr.length);
}