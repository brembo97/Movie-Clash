const root = document.querySelector(".autoComplete");
root.innerHTML = `
    <label><b>Search For a Movie<b><label>
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

const getInput = async event => {
    //Get API data
    const movies = await fetchData(event.target.value);

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
        results.appendChild(option);
    }
}

input.addEventListener('input', debounce(getInput, 500));
