import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';

/** Global state of the app
* - Search Object
* - current cocktail object
* - Shopping List Object
* - Liked cocktails
*/
const state = {};
window.state = state;

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
    }
});


/*
// RECIPE CONTROLLER
*/
// 
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
            
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
        } catch (err) {
            console.log(err)
            alert('Error processing recipe. ooops');
        }
    }
};


['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// 
/*
// LIST CONTROLLER
*/
//

const controlList = () => {
    //Create New List if not existent yet
    if (!state.list) state.list = new List();

    //Add each ingredient to the List and UI
    state.recipe.ingredientAmounts.forEach(el => {
        const item = state.list.additem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);
    // Handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

// 
/*
// LIKES CONTROLLER
*/
//

//Testing Method
//state.likes = new Likes();

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // User has NOt liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.alcoholic,
            state.recipe.thumb
        );
        // Toggle the likes button
            likesView.toggleLikeBtn(true);
        // Add like to UI list
            likesView.renderLikes(newLike);
    } else {
    //User HAS liked current recipe
        // Remove like form state
            state.likes.deleteLike(currentID);
        // Toggle the likes button
            likesView.toggleLikeBtn(false);
        // Remove like from UI list
            likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumbLikes());

    
};

// Restore Like recipes on page Load

window.addEventListener('load', ( )=> {
    state.likes = new Likes();
    // Restore likes
    state.likes.readStorage();
    // Toggle like button
    likesView.toggleLikeMenu(state.likes.getNumbLikes());
    // Render exhisting Likes
    state.likes.likes.forEach(like => likesView.renderLikes(like));

});

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

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping List
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like Controller
        controlLike();
    }
});

window.l = new List();