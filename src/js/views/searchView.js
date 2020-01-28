import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () =>  {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
}

const limitDrinkTitle = (strDrink, limit = 17) => {
    const newTitle = [];
    if (strDrink.length > limit) {
        strDrink.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    }
    return strDrink;
};

//Render Recipes
const renderRecipe = drinks => {
    const markup = `
                    <li>
                        <a class="results__link" href="#${drinks.idDrink}">
                            <figure class="results__fig">
                                <img src="${drinks.strDrinkThumb}" alt="${drinks.strDrink}">
                            </figure>
                            <div class="results__data">
                                <h4 class="results__name">${limitDrinkTitle(drinks.strDrink)}</h4>
                                <p class="results__author">${drinks.strCategory}</p>
                            </div>
                        </a>
                    </li>
                `
    elements.searchResultList.insertAdjacentHTML('afterbegin', markup);
    console.log('- searchView.js - renderRecipe - ')
};

// Create pages Buttons
// type: 'prev' or 'next'
const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
            </svg>
        </button>
`

//Render Buttons
const renderButtons =(page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;

    if (page === 1 && pages > 1) {
        //Button to next page
        button = createButton(page, 'next');

    } else if(page < pages) {
        //Button to previous and next pages
        button = `
            ${button = createButton(page, 'prev')}
            ${button = createButton(page, 'next')}
        `

    } else if (page === pages && pages > 1) {
        //Button to previous page
        button = createButton(page, 'prev');
    }
    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

//Render Results
export const renderResults = (drinks, page = 1, resPerPage = 9) =>  {
    // Render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    drinks.slice(start, end).forEach(renderRecipe);
    console.log(`- searchView.js - renderResults - `)

    // Render pagination buttons
    renderButtons(page, drinks.length, resPerPage);

};

    console.log(`- searchView.js - Page -`)