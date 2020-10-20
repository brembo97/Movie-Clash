createAutoComplete({
    root: document.querySelector(".autoComplete"),
    fetchData(searchTerm){
        return fetchMovies(searchTerm);
    },
    renderOption(movie){
        return renderMovie(movie);
    },
    changeInput(movie){
        return movie.Title;
    },
    onItemSelect(movie){
        onMovieSelect(movie);
    }
})

const fetchMovies = async searchTerm => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "ef5afcd6",
            s: searchTerm
        }
    })

    if(response.data.Error) return [];

    return response.data.Search;
}

const renderMovie = movie => {
    let imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}">
    ${movie.Title} (${movie.Year})
    `
}

const onMovieSelect = async (movie) => {
    const movieDetails = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "ef5afcd6",
            i: movie.imdbID
        }
    })
    const summary = document.querySelector("#summary");
    summary.innerHTML = movieTemplate(movieDetails.data);
}

const movieTemplate = movieDetails => {
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetails.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}
