
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

const fetchData = async searchInput => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "ef5afcd6",
            s: searchInput
        }
    })
    return response.data.Search;
}