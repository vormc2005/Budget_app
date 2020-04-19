var budgetController = (function () {

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    } ;
    
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.totals[type]=sum;

    }
   

    var data = {
        allItems: {
            exp:[],
            inc: []
        },
        totals: {
            exp: 0,
            inc:0
        }, 
        budget: 0,
        percentage: -1
       
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;

            //create new id 
            if(data.allItems[type].length > 0){
            ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }else{
                ID = 0;
            }


            
            if(type ==='exp'){
            newItem = new Expense(ID, des, val)
            }else if(type ==='inc'){
                newItem = new Income(ID, des, val) ;
            }
//push new data into structure
            data.allItems[type].push(newItem)
            //return new element
            return newItem;
        },

        calculateBudget: function(){
            //calculate total income and expenses

            calculateTotal('exp');
            calculateTotal('inc');
            //calculate budget: income -expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate percentage that we spent

            
            if(data.totals.inc > 0){
            data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
            } else {
                data.percentage = -1;
            }

            //Expense =100 and income 200, spent 50% = 100/200 = 0.5*100

        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }


        },

        testing: function(){
            console.log(data)
        }
    }

})();



/*
*                               UI Controller
 * 
****************************** */

var UiContorller = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    }

    return {
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addlistItem: function(obj, type){
            var html, newHtml;
            // Create HTML string with place holder text
            if(type==='inc'){
                element = DOMstrings.incomeContainer;
          html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
          html ='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>   <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }


            //Replace the placeholseder text with some 

            newHtml = html.replace('%id%', obj.id);           
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function(){
            var fields, fieldsArr;
           fields =  document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

         fieldsArr=  Array.prototype.slice.call(fields);

         fieldsArr.forEach(function(current, index, array){
             current.value = "";

         });
         fieldsArr[0].focus();
        },
        
        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent= obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent= obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent= obj.totalExp;
            
            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent= obj.percentage + "%";

            }else{document.querySelector(DOMstrings.percentageLabel).textContent= '---';}
        },

        getDomstrings: function () {
            return DOMstrings;
        }

    };

})();


/*
                                                        controller
*/

var contorller = (function (budgetCtrl, Uictrl) {

    var setUPEvenListners = function () {

        var DOM = Uictrl.getDomstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', function () {
            ctrlAddItem();

        });

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        });
    }

    var updateBudget = function(){
          // 1. calculate budget

         budgetCtrl.calculateBudget();

          // 2. Return budget
        var budget = budgetCtrl.getBudget();


        // 3. Display the budget in the UI
       Uictrl.displayBudget(budget);
        //
    }
    
    var ctrlAddItem = function () {
        var input, newItem;
        // 1.Get the field input data
        var input = Uictrl.getinput();
        console.log(input);
        if(input.description!==""&& !isNaN(input.value) &&  input.value >0){
        //  2. add the item to the budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the Item to the UI
        UiContorller.addlistItem(newItem, input.type);
        //Clear the fields
        UiContorller.clearFields();

        //1. calculate and update budget
        updateBudget();
      
        }
      
    }

    return {
        init: function(){  
            Uictrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });         
            setUPEvenListners();


        }
    }


})(budgetController, UiContorller);

contorller.init()