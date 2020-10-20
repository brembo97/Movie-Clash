const configAutoComplete = {
    fetchData(searchTerm){
        return fetchMovies(searchTerm);
    },
    renderOption(movie){
        return renderMovie(movie);
    },
    changeInput(movie){
        return movie.Title;
    }
}

createAutoComplete({
    ...configAutoComplete,
    root: document.querySelector("#autocomplete-left"),
    onItemSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#summary-left'), 'left');
    }
})

createAutoComplete({
    ...configAutoComplete,
    root: document.querySelector("#autocomplete-right"),
    onItemSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#summary-right'), 'right');
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

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryDiv, side) => {
    const movieDetails = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "ef5afcd6",
            i: movie.imdbID
        }
    })
    //Store movie data
    side === 'left' ? leftMovie = movieDetails.data : rightMovie = movieDetails.data;

    //Render movie stats
    summaryDiv.innerHTML = movieTemplate(movieDetails.data);

    //Compare movie stats
    if(leftMovie && rightMovie){
        compareStats();
    }
}

const compareStats = () => {
    const leftStats = document.querySelectorAll("#summary-left .notification");
    const rightStats = document.querySelectorAll("#summary-right .notification");

    leftStats.forEach((leftStat, index) => {
        const rightStat = rightStats[index];

        const leftValue = parseFloat(
            Math.round(leftStat.dataset.value * 100) / 100
            );
        const rightValue = parseFloat(
            Math.round(rightStat.dataset.value * 100) / 100
            );

        //Change color of loser and winner movie feature
        if(leftValue > rightValue){
            leftStat.classList.remove('is-danger');
            leftStat.classList.add('is-active');

            rightStat.classList.remove('is-active');
            rightStat.classList.add('is-danger');
        }
        else if(leftValue < rightValue){
            rightStat.classList.remove('is-danger');
            rightStat.classList.add('is-active');

            leftStat.classList.remove('is-active');
            leftStat.classList.add('is-danger');
        }
    })
}

//Select relevant movie data from API response and return HTML structure
const movieTemplate = movieDetails => {
    const awards = movieDetails.Awards.split(' ').reduce((acc, curr) => {
        let value = parseInt(curr);

        if(isNaN(value)) return acc;

        else return acc + value;
    }, 0);

    const [,{Value: tomatoes}] = movieDetails.Ratings

    const tomatoeRating = parseInt(tomatoes.replace(/%/g, ''))
    const metascore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));

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
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${tomatoeRating} class="notification is-primary">
            <p class="title">${tomatoes}</p>
            <p class="subtitle">Rotten Tomatoes</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}
