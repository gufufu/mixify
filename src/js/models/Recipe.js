import axios from 'axios';
import {key} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?key=${key}&i=${this.id}`);
            
            const resArray = res.data.drinks["0"];
            
            this.title = resArray.strDrink;
            this.alcoholic = resArray.strAlcoholic;
            this.glass = resArray.strGlass;
            this.instructions = resArray.strInstructions;
            this.thumb = resArray.strDrinkThumb;

            const ingList = [resArray.strIngredient1, resArray.strIngredient2, resArray.strIngredient3, resArray.strIngredient4, resArray.strIngredient5, resArray.strIngredient6];
            console.log(ingList);

            //console.log(resArray);
        } catch (error) {
            console.log('error get recipe');
            //alert('OOOPS something went wrong with this mixing!');
        }
    }

    calcTime() {
        //assuming that we need 15 seconds for each 3 ingredients
        const numIng = this.ingredient;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    };

    calcServings() {
        this.servings = 2;
    }
};

