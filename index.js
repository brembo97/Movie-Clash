const input = document.querySelector("#searchBar")

const getInput = async event => {
    const movies = await fetchData(event.target.value);
    console.log(movies);
}

input.addEventListener('input', debounce(getInput, 500));
