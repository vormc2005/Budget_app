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
    }    
   

    var data = {
        allItems: {
            exp:[],
            inc: []
        },
        totals: {
            exp: 0,
            inc:0
        }
       
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
        expensesContainer: '.expenses__list'
    }

    return {
        getinput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
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


    
    var ctrlAddItem = function () {
        var input, newItem;
        // 1.Get the field input data
        var input = Uictrl.getinput();
        console.log(input);
        //  2. add the item to the budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the Item to the UI
        UiContorller.addlistItem(newItem, input.type);
        // 4. calculate budget
        // 5. Display the budget in the UI
        // 6. add key press event

        console.log("works")
    }

    return {
        init: function(){           
            setUPEvenListners();


        }
    }


})(budgetController, UiContorller);

contorller.init()