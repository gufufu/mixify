import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
    
    //TESTING UNIT 
    //const query = '11375';
    //console.log(query);
    
    // 1- get query from view
    const query = searchView.getInput();

    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);
        //console.log(' - index.js - renderLoader - ')

        try {
            // 4. Search for cocktails
        await state.search.getResults();

        // 5. Render results on UI
        clearLoader();
        //console.log(`- index.js - clearLoader -`)
        searchView.renderResults(state.search.result);
        //console.log('- index.js - renderResults -');
        } catch (error) {
            alert('Something went wrong with this search.');
            clearLoader();
        };
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// TESTING UNIT
/*
window.addEventListener('load', e => {
    e.preventDefault();
    controlSearch();
});
*/

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});

// RECIPE CONTROLLER
//TESTING UNIT 
//const r = new Recipe(11375);
//r.getRecipe();
//console.log(r);

const controlRecipe = async () => {
    
    //get id form url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        // Highlight selected search Item
        if (state.search) searchView.highlightSelected(id);
        // Create new recipe object
        state.recipe = new Recipe(id);
        ///TESTING UNIT
        //window.r = state.recipe;
        try {
            // Get recipe data
            await state.recipe.getRecipe();
            await state.recipe.parseIngredientAmounts();
            //console.log(state.recipe);
            
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            //console.log(state.recipe);
        } catch (err) {
            alert('Error processing recipe. ooops');
        }
    }
    //console.log(state.recipe);
};


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    }
    console.log(state.servings)
});