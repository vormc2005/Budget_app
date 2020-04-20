var budgetController = (function () {

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome){
        if(totalIncome > 0){
        this.percentage = Math.round(this.value/totalIncome *100)
        }else{
            this.percentage = -1
        }

    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

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

        deleteItem: function (type, id){
            var ids, index;
            
            ids = data.allItems[type].map(function(current){
                return current.id;

            });

            index = ids.indexOf(id)
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: function(){
            /*
            a=20
            b=10
            c=40
            income = 100*/
          
            data.allItems.exp.forEach(function(cur){
                cur.calculatePercentage(data.totals.inc);

            });
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
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
        percentageLabel: '.budget__expenses--percentage',
        container:'.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber = function(num, type){
        var numSplit, int, dec, type;
        /*
        + or - before number
        exactly 2 decimal points
        commam separating the thousands

    
        */
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0, int.length - 3)+ ',' + int.substr(int.length -3, int.length); //input 2310, output 2,310
        }
        dec = numSplit[1];
        

        return (type === 'exp' ? '-'  : '+')+ ' '+int + '.'+ dec;

    };

    var nodeListForEach = function(list, callback){
        for (var i =0; i<list.length; i++){
            callback(list[i], i);
        }
    };

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
          html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
          html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>   <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }


            //Replace the placeholseder text with some 

            newHtml = html.replace('%id%', obj.id);           
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deletelistItems: function(selectorID){
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)

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
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent= formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent= formatNumber(obj.totalInc);
            document.querySelector(DOMstrings.expenseLabel).textContent= formatNumber(obj.totalExp);
            
            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent= obj.percentage + "%";

            }else{document.querySelector(DOMstrings.percentageLabel).textContent= '---';}
        },

        displayPercentages: function(percentages){
            
           var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            

            nodeListForEach(fields, function(current, index){
                //Do something
                if (percentages[index]>0){
                current.textContent = percentages[index]+ '%';
                }else{
                    current.textContent = '---'
                }

            })

        },

        displayMonth: function (){
            var now, year, month;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', "June", 'July', 'August', 'September', 'October', 'November', 'December']
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' +  year;

        },
       
        changedType: function(){

            var fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
            
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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeletItem);

        document.querySelector(DOM.inputType).addEventListener('change', Uictrl.changedType);
    };



    var updateBudget = function(){
          // 1. calculate budget

         budgetCtrl.calculateBudget();

          // 2. Return budget
        var budget = budgetCtrl.getBudget();


        // 3. Display the budget in the UI
       Uictrl.displayBudget(budget);
        //
    };

    updatePercentages = function(){
        //1. Calculate percentages
        budgetCtrl.calculatePercentages();
        //2. Read them from the budget  contoller
        var percentages =budgetCtrl.getPercentages();
        //3. Update user interface
        Uictrl.displayPercentages(percentages);
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
        //4.Clear the fields
        UiContorller.clearFields();

        //5. calculate and update budget
        updateBudget();

        //6. update percentages

        updatePercentages();


      
        }
      
    }

    var ctrlDeletItem = function(event){
        var itemID, splitID, type, ID;

       itemID = event.target.parentNode.parentNode.parentNode.parentNode.id
        console.log(itemID)
        if (itemID){
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            //1. delete Item from the data structure
            budgetCtrl.deleteItem(type, ID);
            //2. delete item from UI
            Uictrl.deletelistItems(itemID)
            //3.00000000000
            updateBudget();
            //4 

            updatePercentages();
        }
    }

    return {
        init: function(){  
            Uictrl.displayMonth()
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