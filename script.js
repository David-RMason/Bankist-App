'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  let movs = sort ? movements.slice().sort((a, b) => b - a) : movements;

  movs.forEach(function (mov, i) {
    let movType = mov > 0 ? "deposit" : "withdrawal";

    let html = `<div class="movements__row">
    <div class="movements__type movements__type--${movType}">${i + 1} ${movType}</div>
    <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

let calcDisplayPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
}

const calcDisplaySummary = function (acc) {
  let incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`

  let out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(out)}€`

  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`
}

let createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(name => name[0])
      .join("");
  })
};
createUsername(accounts);


const updateUI = function (acc) {
  // Display Movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayPrintBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};


// Event handler
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}`
    containerApp.style.opacity = 100;

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);

  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let recieverAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = "";
  // Check if transfer can be done
  if (amount > 0 &&
    recieverAccount.username &&
    currentAccount.balance >= amount &&
    recieverAccount?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = Number(inputLoanAmount.value);

  if (amount > 0 &&
    currentAccount.movements.some(mov => mov > amount * 0.1)
  ) {
    // Add loan
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    let index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;

  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});






// // Callback function
// let deposits = movements.filter(function (mov, i, arr) {
//   return mov > 0;
// });

// // Arrow function
// let withdrawals = movements.filter(mov => mov < 0);

// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);


// /* THE REDUCE METHOD */
// // Adds values in an array, the method looks like follows .reduce(function(accumilator, element, index, array){...}, initial value of accumilator) The accumilator will be the value that we return that has added all the elements.
// // The accumilator means that you do not have to have a throwaway variable declared


// // let balance = movements.reduce(function (acc, el, i, arr) {
// //   console.log(`Iteration ${i}: ${acc}`);
// //   return acc + el;
// // }, 0);

// // ARROW FUNCTION .REDUCE()
// let balance = movements.reduce((acc, el) => acc + el, 0);
// console.log(balance);

// // Maximum value
// let maxMov = movements.reduce((acc, el) => el > acc ? acc = el : acc = acc, movements[0]);
// console.log(maxMov);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);


/////////////////////////////////////////////////



// /* ---- SIMPLE ARRAY METHODS ---- */

// // Methods are functions we can call on objects, so we can say that methods are attached to objects

// let arr = ["a", "b", "c", "d", "e"];


// /* SLICE */
// // This returns a new array starting from a given index, you can also add an end index.
// // Example: arrayName.slice(startParameter, endParameter) Remember endParameter is not included as shown below
// console.log(arr.slice(2)); //returns new array ["c", "d", "e"];
// console.log(arr.slice(2, 4)); // returns new array ["c", "d"];

// // We can also use negative indexes to start from the end of the array too
// console.log(arr.slice(-2)); // returns new array ["d", "e"];
// console.log(arr.slice(-1)); // returns new array ["e"];
// // We can also use a mix of standard and negative
// console.log(arr.slice(1, -2)); // returns new array ["b", "c"];

// // We can create a shallow copy of an array too by not adding any parameters
// console.log(arr.slice()); // returns new array ["a", "b", "c", "d", "e"];
// // This is the same as using the spread operator we have seen before
// console.log([...arr]); // returns new array ["a", "b", "c", "d", "e"];




// /* SPLICE */
// // This is similar to the SLICE method it returns a new array but also mutates the original array as well by removing the specified elements. We usually use this to remove elements from an array rather than saving the new returned array.
// // The parameters passed in are different that SLICE.
// // Example: arrayName.splice(startParameter, elementCount) So you choose your starting index and how many elements after that you want to remove

// // console.log(arr.splice(2)); // returns new array ["c", "d", "e"];
// // console.log(arr); // the orginal array now = ["a", "b"];

// // Often used to remove the last element of an array
// console.log(arr.splice(-1)); // returns new array ["e"];
// console.log(arr); // original array = ["a", "b", "c", "d"];
// console.log(arr.slice(1, 2)); // returns new array ["b", "c"];
// console.log(arr); // original array = ["a", "d"];




// /* REVERSE */
// // This reverses the order of the elements in an array, this mutates the original array
// arr = ["a", "b", "c", "d", "e"];
// let arr2 = ["j", "i", "h", "g", "f"];
// console.log(arr2.reverse());
// console.log(arr2); // arr2 = ["f", "g", "h", "i", "j"]

// /* CONCAT */
// // This is used to concatinate two arrays, this does NOT mutate the original array
// let letters = arr.concat(arr2);
// console.log(letters); // letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
// // The same as using the spread operator
// console.log([...arr, ...arr2]); // returns new array ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]




// /* JOIN */
// // This joins each of the elements in an array with a separator between, this creates an array
// console.log(letters.join(" - ")); // returns new string "a - b - c - d - e - f - g - h - i - j"




// /* ---- NEW "AT" METHOD ---- */
// let arr = [23, 11, 64];
// console.log(arr[0]); // 23
// console.log(arr.at(0)); // 23

// // Find the last element in an array with bracket notation and .at()
// // With BRACKET NOTATION
// console.log(arr[arr.length - 1]); // 64
// console.log(arr.slice(-1)[0]); // 64
// // With at.() METHOD - we can use the negative index like with other array methods making this cleaner
// console.log(arr.at(-1)); // 64

// // The .at() method also works on strings
// console.log("David".at(0)); // "D"
// console.log("David".at(-1)); // "d"



// /* ---- FOR EACH LOOP ---- */
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(`---- Example with forOf loop`);
// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(`Example with forOf loop with .entries`);
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Transaction ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Transaction ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log(`---- Example with forEach loop`);
// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// });

// console.log(`---- Example with forEach loop with arrow function`);
// movements.forEach(movement => {
//   movement > 0 ? console.log(`You deposited ${movement}`) : console.log(`You withdrew ${Math.abs(movement)}`);
// });

// // forEach passes in the current element, index, and array that we are looping through and so we can specify them in the parameter list. 
// // The order of parameters is VERY IMPORTANT!
// // arr.forEach(function (currentElement, currentIndex, entireArray)){});

// console.log(`---- Example with forEach loop with INDEX and ARRAY parameters`);
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Transaction ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Transaction ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });



// /* ---- FOREACH WITH MAPS AND SETS ---- */

// // MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });


// // SET
// // There is no index given for a set and so the second parameter is the same as the first parameter to keep the logic the same for all forEach loops
// let currenciesUnique = new Set(["USD", "GBP", "USD", "EUR", "EUR"]);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, set) {
//   console.log(`${_}: ${value}`);
// })



// /* ---- MAP METHOD ---- */
// // .map(function{}) returns a new array after looping through the array and performing whatever manipulation or task you have written in the callback function
// let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// let eurToUsd = 1.1;

// let movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

// console.log(movements);
// console.log(movementsUSD);

// // Example of same result using forOF loop
// let movementsUSDforOF = [];
// for (const mov of movements) {
//   movementsUSDforOF.push(mov * eurToUsd);
// };
// console.log(movementsUSDforOF);


// // MAP with an Arrow Function
// let movementsUSDArrow = movements.map(mov => mov * eurToUsd);
// console.log(movementsUSDArrow);

// let movementsDescriptions = movements.map((mov, i) => `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrew"} ${Math.abs(mov)}`);

// console.log(movementsDescriptions);




// /* ---- THE MAGIC OF CHAINING METHODS ---- */

// let eurToUsd = 1.1;

// // This first method in a chain must be one that returns an array, such as the filter method.
// // PIPELINE
// let totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   // we can still inspect the code to see what's going on with console logs incase of errors
//   .map((mov, i, arr) => {
//     console.log(arr);
//     return mov * eurToUsd;
//   })
//   // .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);




// /* ---- THE FIND METHOD ---- */
// // We can use this to retrieve one element of an array based on a condition. It will only return the first element of an array that meets the condition

// let firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// // Find method
// let account = accounts.find(acc => acc.owner === "Jessica Davis");
// console.log(account);

// // As a for of loop
// const findAccount = function (accounts, nameSearch) {
//   for (const name of accounts) {
//     if (name.owner === nameSearch)
//       return name;
//   };
// }
// console.log(findAccount(accounts, "Jessica Davis"));






// /* ---- SOME and EVERY METHOD ---- */
// // SOME
// // Using .some() to find out if movements has a deposit using the some method
// // This will check each element and return true if a condition is met or false if it is not
// let anyDeposits = movements.some(mov => mov > 0);
// console.log(anyDeposits); // True

// let anyDepositGreater5000 = movements.some(mov => mov > 5000);
// console.log(anyDepositGreater5000); // False


// // EVERY
// // Returns true if every element meets the condtion in the call back function
// console.log(movements.every(mov => mov > 0)); // False
// console.log(account4.movements.every(mov => mov > 0)); // True


// // Separate Callback

// let deposit = mov => mov > 0;

// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));




// /* ---- FLAT and FLATMAP METHOD ---- */

// // Flat takes all elements in nested arrays and lifts them up to the parent array. aka flattens the array. By default it runs at 1 depth, but you can increase it by adding the level of depth in the parameters .flat(Level of Depth);

// // Default depth
// let arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat()); // [ 1, 2, 3, 4, 5, 6, 7, 8];

// // Default depth for deep nested arrays
// let arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat()); // [[1, 2], 3, 4,[5, 6], 7, 8];

// // Second level of nesting
// console.log(arrDeep.flat(2)); // [ 1, 2, 3, 4, 5, 6, 7, 8];


// // Finding out the total balance of all bank accounts

// // Chaining all together
// let overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov);

// console.log(overallBalance);

// // flatMap Method - Remember flatMap only flattens one depth deep
// let overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov);

// console.log(overallBalance2);




// /* ---- SORTING ARRAYS ---- */
// // The .sort() method will allow us to re-order an array. This mutates the array so we must be careful with this method
// // Re-ordering alphabetically
// let owners = ["David", "Adam", "Jon", "William"];
// console.log(owners.sort()); // [ "Adam", "David", "Jon", "William" ]


// // Numbers
// console.log(movements);
// // The .sort() method converts the numbers by default to strings then re-order alphabetically which is why the order might not seem logical at first
// // console.log(movements.sort()); // [ -130, -400, -650, 1300, 200, 3000, 450, 70 ]

// // How to compare and sort with numbers
// // return < 0, A, B (keep order)
// // return < 0, B, A (switch order)

// // // Ascending
// // movements.sort((a, b) => {
// //   if (a > b) {
// //     return 1;
// //   } else if (b > a) {
// //     return -1;
// //   }
// // });

// movements.sort((a, b) => a - b);
// console.log(movements);

// // // Descending
// // movements.sort((a, b) => {
// //   if (a > b) return -1;
// //   if (b > a) return 1;
// // });
// movements.sort((a, b) => b - a);
// console.log(movements);




/* ---- MORE WAYS OF CREATING ARRAYS ---- */

// Using the array contructor method
// With only one parameter
let x = new Array(7); // [, , , , , ,]

// Fill will mutate the array and fill it with the specified value
// x.fill(1);[1, 1, 1, 1, 1, 1, 1]
// We can define a start parameter and an end parameter .full(value, start, end);
x.fill(1, 3, 5); // [,,,1,1,,]

// Using on existing arrays
let arr = [1, 2, 3, 4, 5, 6, 7];
arr.fill(23, 2, 6);
console.log(arr); // [1, 2, 23, 23, 23, 23, 7]


// Array.from()
let y = Array.from({ length: 7 }, () => 1);
console.log(y); // [1, 1, 1, 1, 1, 1, 1]

let z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z); // [1, 2, 3, 4, 5, 6, 7]

// Using from to create an array of 100 dice rolls
let hundredDiceRolls = Array.from({ length: 100 }, () => Math.floor(Math.random() * 6) + 1);
console.log(hundredDiceRolls);



labelBalance.addEventListener("click", function (e) {
  e.preventDefault();

  let movementsUI = Array.from(document.querySelectorAll(".movements__value"),
    el => Number(el.textContent.replace("€", ""))
  );

  console.log(movementsUI);

  // Alternate form of creating an array from node list
  let movementsUI2 = [...document.querySelectorAll(".movements__value")];
  console.log(movementsUI2);

})