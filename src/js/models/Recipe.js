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
            
            const arrayMeasuresList = [resArray.strMeasure1, resArray.strMeasure2, resArray.strMeasure3, resArray.strMeasure4, resArray.strMeasure5, resArray.strMeasure6, resArray.strMeasure7, resArray.strMeasure8, resArray.strMeasure9, resArray.strMeasure10]//.join().replace(/(\r\n|\n|\r)/gm, "").replace(/,/g, '')

           console.log(arrayMeasuresList )

            this.title = resArray.strDrink;
            this.alcoholic = resArray.strAlcoholic;
            this.glass = resArray.strGlass;
            this.instructions = resArray.strInstructions;
            this.thumb = resArray.strDrinkThumb;
            this.ingredientsFile = ingList;
            this.measuresFile = measuresList;
            
            for (var i = 0; i < this.ingredientsFile.length; i++) 
                if (arrayMeasuresList[i] == null) {
                    arrayMeasuresList[i] = '1 portion '
                    //console.log(arrayMeasuresList[i])
                } else if(arrayMeasuresList[i].includes('Juice')) {
                    arrayMeasuresList[i] = '1 portion Juice of'
                    //console.log(arrayMeasuresList[i].indexOf('Juice') !== 1)
                } else if(arrayMeasuresList[i].includes('Fill with') || arrayMeasuresList[i].includes('Fill to ')) {
                    arrayMeasuresList[i] = '1 Fill with'
                } else if(arrayMeasuresList[i].includes('Add 10 oz')) {
                    arrayMeasuresList[i] = '10 oz'
                } else if(arrayMeasuresList[i].includes('cubes')) {
                    arrayMeasuresList[i] = '1 portion'
                } else if(arrayMeasuresList[i].includes('top up')) {
                    arrayMeasuresList[i] = '1 top up'
                } else if(arrayMeasuresList[i].includes('Garnish')) {
                    arrayMeasuresList[i] = '1 Garnish'
                    //console.log(arrayMeasuresList[i].indexOf('Add') !== 1)
                } else if(arrayMeasuresList[i].includes('Around rim')) {
                    arrayMeasuresList[i] = '1 pinch'
                } else if(arrayMeasuresList[i].includes('Mint')) {
                    arrayMeasuresList[i] = 'leaf Mint'
                }

            this.filteredArrayMeasuresList = arrayMeasuresList.filter(item => item !== undefined && item !== null);
                
            const c = this.filteredArrayMeasuresList.map(function(e, i){
                return [e, ingList[i]];
            });
            
            const d = c.join().match(/[^,]+,[^,]+/g)
            this.finalList = d;
           // console.log(this.finalList)
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
        this.servings = 1;
        //console.log(this.servings)
    }

    // Method - new array with the Measures
    parseIngredientAmounts() {
        const unitsLong =['oz', 'dashes', 'portion', 'shots', 'shot', 'Slice', 'tsp', 'tblsp', 'jiggers', 'jigger', 'pinch', 'Fill', 'drop'];
        const unitsShort = ['oz', 'dash', 'portion', 'shots', 'shot', 'slice', 'tsp', 'tbsp', 'jiggers', 'jigger', 'pinch', 'fill', 'drop'];
        //const units = [...unitsShort, 'kg', 'g', 'cl'];


        const newIngredientAmounts = this.finalList.map(el => {
           //console.log(this.finalList)
            // 1 Uniformize all units
            let newIng = el.charAt(0).toUpperCase() + el.slice(1)
            unitsLong.forEach((unit, i) => {
                newIng = newIng.replace(unit, unitsShort[i]);
            });

            // 2 Remove commas
            newIng = newIng.replace(/\,/g,' ');
            
           // console.log(newIng)


            // 3 Parse ingredients into count, unit and ingredientes
            const arrMeasures = newIng.split(' ');
            //console.log(arrMeasures)
            const unitIndex = arrMeasures.findIndex(el2 => unitsShort.includes(el2));
            
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
        //console.log(this.ingredientAmounts)
    }
    
    // Search all items that finish with number and add them to an array without the numbers
    updateServings (type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        this.ingredientAmounts.forEach(ing => {
            ing.count *= (newServings / this.servings);
           // console.log(this.servings)
        });
        //Ingredients
        this.servings = newServings;
    };
    
};

