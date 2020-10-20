const createAutoComplete = ({
        root,
        fetchData,
        renderOption,
        changeInput,
        onItemSelect
    }) => {

    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input"/>
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results">
                </div>
            </div>
        </div>
    `

    const input = root.querySelector(".input");
    const dropdown = root.querySelector(".dropdown");
    const results = root.querySelector(".dropdown-content");

    const getInput = async event => {
        //Get API data
        const items = await fetchData(event.target.value);

        //Handle empty searches
        if(!items.length){
            dropdown.classList.remove('is-active');
            return;
        }

        //Show dropdown HTML
        dropdown.classList.add("is-active");

        //Clear previous results
        results.innerHTML = '';
        
        //Render item HTML
        for(let item of items){
            
            const option = document.createElement('a');
            option.classList.add("dropdown-item");

            option.innerHTML = renderOption(item);
            //Add event handler to option
            option.addEventListener('click', () => {
                //Update input
                input.value = changeInput(item);
                dropdown.classList.remove('is-active');

                //Get and render item details
                onItemSelect(item);
            })
            //Render option
            results.appendChild(option);
        }
    }

    input.addEventListener('input', debounce(getInput, 500));

    document.addEventListener('click', event => {
        if(!root.contains(event.target)){
            dropdown.classList.remove('is-active');
        }
    })
}