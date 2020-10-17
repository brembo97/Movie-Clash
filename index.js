const root = document.querySelector(".autoComplete");
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results">
            </div>
        </div>
    </div>
`

const input = document.querySelector(".input");
const dropdown = document.querySelector(".dropdown");
const results = document.querySelector(".dropdown-content");
const summary = document.querySelector("#summary");

const getInput = async event => {
    //Get API data
    const movies = await fetchData(event.target.value);

    //Handle empty searches
    if(!movies.length){
        dropdown.classList.remove('is-active');
        return;
    }

    //Show dropdown HTML
    dropdown.classList.add("is-active");

    //Clear previous results
    results.innerHTML = '';
    
    //Render movie HTML
    for(let movie of movies){
        let imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        
        const option = document.createElement('a');
        option.classList.add("dropdown-item");

        option.innerHTML = `
        <img src="${imgSrc}">
        ${movie.Title}
        `
        //Add event handler to option
        option.addEventListener('click', () => {
            //Update input
            input.value = movie.Title;
            dropdown.classList.remove('is-active');

            //Get and render movie details
            fetchMovieDetails(movie.imdbID);
        })

        results.appendChild(option);
    }
}

const fetchMovieDetails = async movieID => {
    const movieDetails = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "ef5afcd6",
            i: movieID
        }
    })
    
    summary.innerHTML = movieTemplate(movieDetails.data);
}

input.addEventListener('input', debounce(getInput, 500));

document.addEventListener('click', event => {
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active');
    }
})
