
let timeOutId;
const debounce = (func, delay = 1000) => {
    return (...args) => {
        if(timeOutId){
            clearInterval(timeOutId);
        }
        timeOutId = setTimeout(()=> {
            func.apply(null, args);
        }, delay);
    }
}