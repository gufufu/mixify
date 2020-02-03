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
            const ingList = [resArray.strIngredient1, resArray.strIngredient2, resArray.strIngredient3, resArray.strIngredient4, resArray.strIngredient5, resArray.strIngredient6, resArray.strIngredient7, resArray.strIngredient8, resArray.strIngredient9, resArray.strIngredient10].filter(item => item !== undefined && item !== null);
            const measuresList = [resArray.strMeasure1, resArray.strMeasure2, resArray.strMeasure3, resArray.strMeasure4, resArray.strMeasure5, resArray.strMeasure6, resArray.strMeasure7, resArray.strMeasure8, resArray.strMeasure9, resArray.strMeasure10].filter(item => item !== undefined && item !== null);
            
            const arrayMeasuresList = [resArray.strMeasure1, resArray.strMeasure2, resArray.strMeasure3, resArray.strMeasure4, resArray.strMeasure5, resArray.strMeasure6, resArray.strMeasure7, resArray.strMeasure8, resArray.strMeasure9, resArray.strMeasure10]

            //console.log(arrayMeasuresList )

            const regEx = arrayMeasuresList.join().split(/[\r\n|\r|\n|" "]+/);
            console.log(regEx)

            this.title = resArray.strDrink;
            this.alcoholic = resArray.strAlcoholic;
            this.glass = resArray.strGlass;
            this.instructions = resArray.strInstructions;
            this.thumb = resArray.strDrinkThumb;
            this.ingredientsFile = ingList;
            this.measuresFile = measuresList;
            
            for (var i = 0; i < this.ingredientsFile.length; i++)
            if (arrayMeasuresList[i] == null)
            arrayMeasuresList[i] = '1 portion ';
            const filtered = arrayMeasuresList.filter(item => item !== undefined && item !== null);
            //console.log(filtered)
            this.filteredMeasuresList = filtered;

            const c = filtered.map(function(e, i){
                return [e, ingList[i]];
            });
            //console.log(c)
            

            const d = c.join().split(/,(?=\s*\d+)/);
            console.log(d)

            this.finalList = d;
            

        } catch (error) {
            alert('OOOPS something went wrong with this mixing!');
        }
        
    }
      
    // Calculate amount of time based on ingredients amount used
    calcTime() {
        //assuming that we need 15 seconds for each 3 ingredients
        const numIng = this.ingredientsFile.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 30;
    };
    // Calculate Amounts needed based on number of servings
    calcServings() {
        this.servings = 2;
        //console.log(this.servings)
    }

    // Method - new array with the Measures
    parseIngredientAmounts() {
        const unitsLong =['parts', 'teaspoon', 'teaspoons', 'tblsp', 'tablespoons', 'tablespoon', 'ounces', 'ounce', 'cups', 'pounds', 'dashes', 'dash', 'fifth', 'L', 'l', 'small bottle', 'pint', 'cl', 'mlts', 'clts', 'tsts', 'altse', 'sltsice', 'Mapltse'];//TODO check this List - hack
        const unitsShort = ['parts', 'tsp', 'tsps', 'tbsps', 'tbsps', 'tbsp', 'oz', 'oz', 'cup', 'pound', 'dash', 'dash', '1/5', 'lts', 'lts', 'sm btl', 'pint', 'cl', 'ml', 'cl', '', 'ale', 'slice', 'Maple'];
        const units = [...unitsShort, 'kg', 'g', 'cl'];

        //console.log(this.finalList)
        //console.log(this.filteredMeasuresList)

        const newIngredientAmounts = this.finalList.map(el => {
            // 1 Uniformize all units
            let newIng = el;
            unitsLong.forEach((unit, i) => {
                newIng = newIng.replace(unit, units[i]);
            });

            // 2 Remove commas
            newIng = newIng.replace(/\,/g,' - ');
            //console.log(newIng)
            
            // 3 Parse ingredients into count, unit and ingredientes
            const arrMeasures = newIng.split(' ');
            const unitIndex = arrMeasures.findIndex(el2 => units.includes(el2));
            //console.log(arrMeasures)
            let objMeasures;
            if (unitIndex > -1) {

                //There is a unit
                const arrCount = arrMeasures.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrMeasures[0].replace('-', '+'));
                    
                } else {
                    // Convert units to eval (4 - 1/2 = 4.5)
                    count = eval(arrMeasures.slice(0, unitIndex).join('+'))
                }

                objMeasures = {
                    count,
                    unit: arrMeasures[unitIndex],
                    ingredient: arrMeasures.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(arrMeasures[0], 10)) {
                
                //There is NO unit, but 1st element is number
                objMeasures = {
                    count: (parseInt(arrMeasures[0], 10)),
                    unit: '',
                    ingredient: arrMeasures.slice(1).join(' ')
                    
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objMeasures = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            } 
            return objMeasures;
        });
        this.ingredientAmounts = newIngredientAmounts;
    }

    // Search all items that finish with number and add them to an array without the numbers
    updateServings (type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        this.ingredientAmounts.forEach(ing => {
            ing.count *= (newServings / this.servings);
            //console.log(this.servings)
        });
        //Ingredients
        this.servings = newServings;
        console.log(this.servings)
    };
    
};

