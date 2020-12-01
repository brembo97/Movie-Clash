beforeEach(() => {
    
    const target = document.getElementById('target')
    target.innerHTML = "";
    createAutoComplete({
        root: target,
        fetchData: () => {
            return [
                {Title: "Avangers"},
                {Title: "I Am Legend"},
                {Title: "Along Went Polly"}
            ]
        },
        renderOption: (item) => `<li>${item.Title}</li>`
    })
})

const waitFor = (htmlElement) => {

    return new Promise((resolve, reject) =>{

        let interval = setInterval(() => {
            const movie = document.querySelector(htmlElement);

            if(movie){
                clearInterval(interval)
                clearTimeout(timeout)
                resolve()
            }
        }, 30)
        
        const timeout = setTimeout(() => {
            clearInterval(interval);
            reject();
        }, 2000)
    })
}

it("Checks empty dropdown", () => {

    const dropdown = document.querySelector('.dropdown');
    expect(dropdown.className).to.not.include('is-active')
})

it("Checks for dropdown items on input", async () => {

    const input = document.querySelector('.input');
    input.value = "Avengers";
    input.dispatchEvent(new Event('input'))

    await waitFor('.dropdown-item');

    const dropdown = document.querySelector('.dropdown');
    expect(dropdown.className).to.include('is-active')
})

it("Checks for correct amount of movies", async () => {

    const input = document.querySelector('.input');
    input.value = "Avengers";
    input.dispatchEvent(new Event('input'))

    await waitFor('.dropdown-item');

    const items = document.querySelectorAll('.dropdown-item');
    expect(items.length).to.equal(3);
})