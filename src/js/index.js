import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/** Global state of the app
* - Search Object
* - current cocktail object
* - Shopping List Object
* - Liked cocktails
*/
const state = {};


/*
// SEARCH CONTROLLER
*/

const controlSearch = async () => {
    // 1- get query from view
    const query = searchView.getInput();
    //console.log(query);

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);
        console.log(' - index.js - renderLoader - ')

        try {
            // 4. Search for cocktails
        await state.search.getResults();

        // 5. Render results on UI
        clearLoader();
        console.log(`- index.js - clearLoader -`)
        searchView.renderResults(state.search.result);
        console.log('- index.js - renderResults -');
        } catch (error) {
            alert('Something went wrong woth this search.');
            clearLoader();
        };
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});


/*
// RECIPE CONTROLLER

//const r = new Recipe(17193);
//r.getRecipe();
//console.log(r);
*/

const controlRecipe = async () => {
    
    //get id form url
    const id = window.location.hash.replace('#', '');
    //console.log(id);

    if (id) {
        
        // Prepare UI for changes

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Render recipe
            //console.log(state.recipe);

        } catch (err) {
            alert('Error processing recipe. ooops');
        }
    }
};


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
