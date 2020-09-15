'use strict';
const isNumber = function (n) {
   return !isNaN(parseFloat(n)) && isFinite(n);
};

//Получение со страницы элементов
const startId = document.querySelector('#start'),
   cancel = document.querySelector('#cancel'),
   blockStart = document.querySelector('#start').setAttribute('disabled', 'true'),
   incomeAdd = document.getElementsByTagName('button')[0],
   expensesAdd = document.getElementsByTagName('button')[1],
   data = document.querySelector('.data'),
   depositCheck = document.querySelector('#deposit-check');



//с value
const budgetMonthValue = document.querySelector('.budget_month-value'),
   budgetDayValue = document.querySelector('.budget_day-value'),
   expensesMonthValue = document.querySelector('.expenses_month-value'),
   additionalIncomeValue = document.querySelector('.additional_income-value'),
   additionalExpensesValue = document.querySelector('.additional_expenses-value'),
   incomePeriodValue = document.querySelector('.income_period-value'),
   targetMonthValue = document.querySelector('.target_month-value');

// инпуты
let additionalIncomeItem = document.querySelectorAll('.additional_income-item'),
   salaryAmount = document.querySelector('.salary-amount'),
   incomeTitle = document.querySelector('.income-title'),
   incomeItem = document.querySelectorAll('.income-items'),
   expensesTitle = document.querySelector('.expenses-title'),
   expensesItem = document.querySelectorAll('.expenses-items'),
   additionalExpensesItem = document.querySelector('.additional_expenses-item'),
   targetAmount = document.querySelector('.target-amount'),
   periodAmount = document.querySelector('.period-amount'),
   periodSelect = document.querySelector('.period-select');

// Депозит
const depositBank = document.querySelector('.deposit-bank'),
   depositAmount = document.querySelector('.deposit-amount'),
   depositPercent = document.querySelector('.deposit-percent');

class AppData {
   constructor() {
      this.budget = 0;
      this.income = {};
      this.incomeMonth = 0;
      this.addIncome = [];
      this.expenses = {};
      this.addExpenses = [];
      this.deposit = false;
      this.percentDeposit = 0;
      this.moneyDeposit = 0;
      this.budgetDay = 0;
      this.budgetMonth = 0;
      this.expensesMonth = 0;
   }



   blockBtn() {
      let blockStart;
      if (salaryAmount.value === '') {
         blockStart = document.querySelector('#start').setAttribute('disabled', 'true');
      } else {
         blockStart = document.querySelector('#start').removeAttribute('disabled');
      }
   }

   start() {
      this.budget = +salaryAmount.value;
      this.getExpenses();
      this.getIncome();
      this.getExpensesMonth();
      this.getIncomeMonth();
      this.getAddExpenses();
      this.getAddIncome();
      this.getInfoDeposit();

      this.getBudget();
      this.showResult();
      this.blockInput();

      // AppData.getStatusIncome();

   }
   getExpenses() {
      expensesItem.forEach((item) => {
         const itemExpenses = item.querySelector('.expenses-title').value;
         const cashExpenses = item.querySelector('.expenses-amount').value;
         if (itemExpenses !== '' && cashExpenses !== '') {
            this.expenses[itemExpenses] = +cashExpenses;
         }
      });
   }

   showResult() {
      budgetMonthValue.value = this.budgetMonth;
      budgetDayValue.value = this.budgetDay;
      expensesMonthValue.value = this.expensesMonth;
      additionalIncomeValue.value = this.addIncome.join(', ');
      targetMonthValue.value = Math.ceil(this.getTargetMonth());
      periodSelect.addEventListener('input', () => {
         incomePeriodValue.value = this.calcPeriod();
      });
      incomePeriodValue.value = this.calcPeriod();
      additionalExpensesValue.value = this.addExpenses.join(', ');
   }
   // Добавляем новые поля по нажатию на + в Обязательных расходах
   addExpensesBlock() {
      const cloneExpensesItem = expensesItem[0].cloneNode(true);
      expensesItem[0].parentNode.insertBefore(cloneExpensesItem, expensesAdd);
      expensesItem = document.querySelectorAll('.expenses-items');
      if (expensesItem.length === 3) {
         expensesAdd.style.display = 'none';
      }
   }
   addIncomeBlock() {
      const cloneIncomeItem = incomeItem[0].cloneNode(true);
      incomeItem[0].parentNode.insertBefore(cloneIncomeItem, incomeAdd);
      incomeItem = document.querySelectorAll('.income-items');
      if (incomeItem.length === 3) {
         incomeAdd.style.display = 'none';
      }
   }

   //Двигаем период
   getPeriodAmount() {
      const periodSelect = document.querySelector('.period-select').value;
      const periodAmount = document.querySelector('.period-amount');
      periodAmount.textContent = periodSelect;
   }


   getAddExpenses() {
      const addExpenses = additionalExpensesItem.value.split(', ');
      addExpenses.forEach((item) => {
         item = item.trim();
         if (item !== '') {
            this.addExpenses.push(item);
         }
      }, this);
   }

   //Получаеся значения доп доходов
   getIncome() {

      incomeItem.forEach((item) => {
         const itemIncome = item.querySelector('.income-title').value;
         const cashIncome = item.querySelector('.income-amount').value;
         if (itemIncome !== '' && cashIncome !== '') {
            this.income[itemIncome] = +cashIncome;
         }
      }, this);
   }

   getAddIncome() {

      additionalIncomeItem.forEach((item) => {
         const itemValue = item.value.trim();
         if (item !== '') {
            this.addIncome.push(itemValue);
         }
      }, this);
   }

   getExpensesMonth() {
      let expensesSum = 0;
      const _this = this;
      for (let key in _this.expenses) {
         expensesSum += +_this.expenses[key];
         _this.expensesMonth = expensesSum;
      }
      return expensesSum;
   }
   getIncomeMonth() {
      let incomesum = 0;

      for (let key in this.income) {
         incomesum += +this.income[key];
         this.incomeMonth = incomesum;
      }
   }

   // Считаем чистые деньги
   getBudget() {
      const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
      this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
      this.budgetDay = Math.floor(this.budgetMonth / 30);
      return this.budgetDay;
   }


   //Достижение цели
   getTargetMonth() {
      return targetAmount.value / this.budgetMonth;
   }

   //Считаем уровень дохода
   getStatusIncome() {
      if (this.budgetDay > 1200) {
         console.log('У вас высокий уровень дохода');
      } else if (this.budgetDay >= 600 && this.budgetDay <= 1200) {
         console.log('У вас средний уровень дохода');
      } else if (0 <= this.budgetDay && this.budgetDay < 600) {
         console.log('К сожалению у вас уровень дохода ниже среднего');
      } else {
         console.log('Что то пошло не так');
      }
   }

   // Депозит в банке
   getInfoDeposit() {
      if (this.deposit) {
         this.percentDeposit = +depositPercent.value;
         this.moneyDeposit = +depositAmount.value;
      }
   }
   calcPeriod() {
      return this.budgetMonth * periodSelect.value;
   }


   // Блок всех кнопок
   blockInput() {
      const elems = data.querySelectorAll('input');
      for (let key of elems) {
         key.setAttribute('disabled', 'true');
      }
      const btnPlus = document.querySelectorAll('.btn_plus');
      for (let key of btnPlus) {
         key.setAttribute('disabled', 'true');
      }
      depositBank.setAttribute('disabled', 'true');
      periodAmount.removeAttribute('disabled');
      periodSelect.removeAttribute('disabled');
      startId.style.display = 'none';
      cancel.style.display = 'block';
   }

   //Сброс
   reset() {
      const elem = document.querySelectorAll('input');
      for (let i = 0; i < elem.length; i++) {
         elem[i].value = '';
         elem[i].removeAttribute('disabled');
         startId.style.display = 'block';
         cancel.style.display = 'none';
         depositBank.style.display = 'none';
         depositPercent.style.display = 'none';
         depositAmount.style.display = 'none';
         depositCheck.checked = false;
         periodSelect.value = 1;
         periodAmount.textContent = 1;
      }
      depositBank.removeAttribute('disabled');
      const btnPlus = document.querySelectorAll('.btn_plus');
      for (let key of btnPlus) {
         key.removeAttribute('disabled');
      }
      AppData.prototype.blockBtn();


      //Удаление доп доходов при сбросе
      const incomeItems = document.querySelectorAll('.income-items');
      if (incomeItems.length >= 1) {
         for (let i = 1; i < incomeItems.length; i++) {
            incomeItems[i].remove();
            incomeAdd.style.display = 'block';
         }
      }
      //Удаление об расходов при сбросе
      const expensesItems = document.querySelectorAll('.expenses-items');
      if (expensesItems.length >= 1) {
         for (let i = 1; i < expensesItems.length; i++) {
            expensesItems[i].remove();
            expensesAdd.style.display = 'block';
         }
      }

   }
   //Работа с процентами
   changePercent() {
      const valueIndex = this.value;
      if (valueIndex === 'other') {
         depositPercent.style.display = 'inline-block';
         depositPercent.value = '';
      } else {
         depositPercent.value = valueIndex;
         depositPercent.style.display = 'none';
      }
   }

   //Проценты пользователя
   userPercent() {
      if (salaryAmount.value !== '') {
         const percentDeposit = +this.value;
         let blockBtn;
         if (percentDeposit > 100 || percentDeposit < -1 || !isNumber(percentDeposit)) {
            alert('Ошибка');
            blockBtn = document.querySelector('#start').setAttribute('disabled', 'true');
         } else if (percentDeposit < 100 && percentDeposit >= 0) {
            blockBtn = document.querySelector('#start').removeAttribute('disabled');
         }
      }
   }


   //Появление депозит окна
   depositHandler() {
      if (depositCheck.checked) {
         depositBank.style.display = 'inline-block';
         depositAmount.style.display = 'inline-block';
         this.deposit = true;
         depositBank.addEventListener('change', this.changePercent);
      } else {
         depositBank.style.display = 'none';
         depositAmount.style.display = 'none';
         depositPercent.style.display = 'none';
         depositBank.value = '';
         depositAmount.value = '';
         this.deposit = false;
         depositBank.removeEventListener('change', this.changePercent);
      }
   }


   eventListeners() {

      salaryAmount.addEventListener('input', this.blockBtn);

      startId.addEventListener('click', this.start.bind(this));

      cancel.addEventListener('click', this.reset);

      incomeAdd.addEventListener('click', this.addIncomeBlock);

      expensesAdd.addEventListener('click', this.addExpensesBlock);

      periodSelect.addEventListener('input', this.getPeriodAmount.bind(this));

      depositCheck.addEventListener('change', this.depositHandler.bind(this));

      depositPercent.addEventListener('input', this.userPercent);

   }
}

const appData = new AppData();
appData.eventListeners();