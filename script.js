'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2022-05-08T14:11:59.604Z',
    '2022-05-27T17:01:17.194Z',
    '2022-08-28T23:36:17.929Z',
    '2022-08-31T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-04-10T14:43:26.374Z',
    '2022-06-25T18:49:59.371Z',
    '2022-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

let formatMovementDate = function (date, locale) {
  let calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  let daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`

  return new Intl.DateTimeFormat(locale).format(date);
};

let formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency
  }).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  let movs = sort ? acc.movements.slice().sort((a, b) => b - a) : acc.movements;

  movs.forEach(function (mov, i) {
    let movType = mov > 0 ? "deposit" : "withdrawal";

    let date = new Date(acc.movementsDates[i]);
    let displayDate = formatMovementDate(date, acc.locale);

    let html = `<div class="movements__row">
    <div class="movements__type movements__type--${movType}">${i + 1} ${movType}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatCur(mov, acc.locale, acc.currency)}</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

let calcDisplayPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(acc.balance, acc.locale, acc.currency)}`;
}

const calcDisplaySummary = function (acc) {
  let incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency)

  let out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency)

  let interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency)
};

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

  // // Display Time
  // labelDate.textContent = new Date();
  // console.log(labelDate.value);

  // Display Movements
  displayMovements(acc);

  // Display Balance
  calcDisplayPrintBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function () {
  let tick = function () {
    let mins = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to the UI
    labelTimer.textContent = `${mins}:${sec}`;

    // When 0 second, log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started"
      containerApp.style.opacity = 0;
    }
    // Decrease 1 second
    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick();
  let timer = setInterval(tick, 1000);
  return timer;
}

// Event handler
let currentAccount, timer;

// // FAKED ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


// Experimenting with API
let currentDate = new Date();
let options = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric"
};
let locale = navigator.language;
console.log(navigator.language);

labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(currentDate);


btnLogin.addEventListener("click", function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]} `
    containerApp.style.opacity = 100;

    // Display time of login
    let currentDate = new Date();
    let options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric"
    };

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(currentDate);

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);

  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = +inputTransferAmount.value;
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

    // Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 &&
    currentAccount.movements.some(mov => mov > amount * 0.1)
  ) {
    setTimeout(function () {
      // Add loan
      currentAccount.movements.push(amount);

      // Add Load Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogoutTimer();

    }, 2500);
  }

  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


// console.log(23 === 23.0);

// // Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 33333333
// // Binary Base - 2 to 0.1
// console.log(0.1 + 0.2); // 0.3000000000000004
// console.log(0.1 + 0.2 === 0.3); // false

// // Conversion
// console.log(Number("23"));
// console.log(+"23");

// // Parsing
// // Javascript will try to work out the number with parseInt
// console.log(Number.parseInt("30px", 10)); // 30
// console.log(Number.parseInt("e23", 10)); // NaN

// // ParseFloat is the go to method to parse a number out of a string
// console.log(Number.parseFloat("2.5rem")); // 2.5
// console.log(Number.parseInt("2.5rem")); // 2

// // isNaN - will attempt type coercion and only to be used to identify if value is NaN
// console.log(Number.isNaN("23px")); // false
// console.log(Number.isNaN(20)); // false
// console.log(Number.isNaN("")); // false
// console.log(Number.isNaN(+"20x")); // true
// console.log(Number.isNaN(23 / 0)); // false

// // isFinite - the best way of checking if a value is a number
// console.log(Number.isFinite("23px")); // false
// console.log(Number.isFinite(20)); // true
// console.log(Number.isFinite("")); // false
// console.log(Number.isFinite(+"20x")); // false
// console.log(Number.isFinite(23 / 0)); // false




// /* ---- Math and Rounding ---- */

// // Getting the root
// // Square root
// console.log(Math.sqrt(25)); // 5
// console.log(25 ** (1 / 2)); // 5
// // Cube root - NO Math method so must be done manually
// console.log(8 ** (1 / 3)); // 2

// // Returning maximum value
// console.log(Math.max(5, 18, 23, 11, 2)); // 23
// // This also does type coercion
// console.log(Math.max(5, 18, "23", 11, 2)); // 23
// // This does not do parsing
// console.log(Math.max(5, 18, "23px", 11, 2)); // NaN

// // Returning minimum value
// console.log(Math.min(5, 18, 23, 11, 2)); // 2


// // CONSTANTS with Math
// // PI
// // Calculating area of a circle using PI and parseFloat
// console.log(Math.PI * Number.parseFloat("10px") ** 2); // 314.1592653589793


// // Random Numbers
// // Radomize dice rolls with Math.random and Math.trunc
// console.log(Math.trunc(Math.random() * 6) + 1);

// let randomInt = (min, max) => Math.round(Math.random() * (max - min)) + min;
// console.log(randomInt(10, 20));



// // Rounding Intergers
// // All following methods perform type coercion
// // .trunc() removes any decimals
// console.log(Math.trunc(23.3)); // 23
// console.log(Math.trunc(23.9)); // 23
// // .round() rounds up or down to the closest integer
// console.log(Math.round(23.3)); // 23
// console.log(Math.round(23.9)); // 24
// // .ceil rounds up and removes the decimal
// console.log(Math.ceil(23.3)); // 24
// console.log(Math.ceil(23.9)); // 24
// // .floor() rounds down 
// console.log(Math.floor(23.3)); // 23
// console.log(Math.floor(23.9)); // 23
// // Difference between .trunc() and .floor() - important with negative numbers
// console.log(Math.trunc(23.3)); // 23
// console.log(Math.floor(23.3)); // 24


// // Rounding Decimals
// // .toFixed() method - always returns a string and not a number
// console.log((2.7).toFixed(0)); // "3" - removes the decimal and rounds
// console.log((2.7).toFixed(3)); // "2.700" - gives 3 decimal places
// // We can convert the returned string to a number with +
// console.log(+(2.7).toFixed(0)); // 3
// console.log(+(2.7).toFixed(3)); // 2.700

// // --- Note - A primitive value does not have methods, and so the toFixed does something called boxing which basically transforms the primitive into an object, then call the method on that object then when the operation is finished it will convert it back to a primitive





// /* ---- Remainder Operator ---- */
// console.log(5 % 2); // 1
// console.log(5 / 2); // 5 = 2 * 2 + 1

// console.log(8 % 3); // 2
// console.log(8 / 3); // 8 = 2 * 3 + 2

// console.log(10 % 5); // 0
// console.log(10 / 5); // 10 = 5 * 2 + 0

// // Working out even numbers
// // An number is even if it can be divided by two and return an interger
// // Therefore number % 2 will return 0 if the number is even
// console.log(6 % 2);
// let isEven = (number) => number % 2 === 0;
// console.log(isEven(4)); // true
// console.log(isEven(5)); // false
// console.log(isEven(6)); // true

// // We can use it to perform an action every nth number of times

// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")]
//     .forEach(function (row, i) {
//       if (i % 2 === 0) row.style.backgroundColor = "lightgrey";
//       if (i % 3 === 0) row.style.backgroundColor = "blue";
//     });
// });




// /* ---- Numeric Separators ---- */
// // 287,460,000,000
// let diameter = 287_460_000_000;
// console.log(diameter); // 287460000000 
// // What this shows is that the engine ignores these "_" separators and we can actually place them anywhere we want if we need to make a number easier to read.

// // Using the "_" to clarify prices
// let priceCents = 345_99;
// console.log(priceCents); // 34599

// // No matter where you place the "_" the number is still recognised as the same
// let transferFee1 = 15_00; // 1500
// let transferFee2 = 1_500; // 1500

// // We CONNOT do the following
// // let n1 = 3._1416; // Not after symbols
// // let n2 = _3.1415; // Not at the beginning
// // let n3 = 3.1415_; // Not at the end
// // let n4 = 3.14__15; // Not twice in a row

// // When we try to convert strings that contain "_" to a number it does not work as expected
// console.log(Number("230000")); // 230000
// console.log(Number("230_000")); // NaN - Cannot convert
// console.log(parseInt("230_000")); // 230 - Ignores the numbers after the "_"



// /* ---- Working with BigInt ---- */
// // Numbers are stored internally with 64bits of which only 53bits for the real number

// // There for the largest number that JavaScript can safely work with is:
// console.log(2 ** 53 - 1); // 9007199254740991
// console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
// // Trying to work with numbers larger than this cannot have guarenteed precision
// console.log(2 ** 53 + 1); // 9007199254740992
// console.log(2 ** 53 + 2); // 9007199254740994
// console.log(2 ** 53 + 3); // 9007199254740996
// console.log(2 ** 53 + 4); // 9007199254740996

// // BigInt allows us to save and work with large numbers
// console.log(4549846516574651654196813216541); // Potentially not accurate

// // Adding "n" at the end allows us to represent the number as BigInt
// console.log(4549846516574651654196813216541n); // 4549846516574651654196813216541n
// // Parsing as bigInt on a large number does not work for large numbers either as it tries to represent the number in the engine before parsing meaning it might not be accurate. You can see the following is not the same result as above.
// console.log(BigInt(4549846516574651654196813216541)); // 4549846516574651934294310649856n

// // Operations
// console.log(10000n + 10000n); // 20000n
// console.log(1556416165496849816531647n * 1561681n); //2430625553749285918330959018607n


// // We cannot mix bigInt and other types
// let huge = 2000515498619864616516n;
// let num = 23;
// // console.log(huge * num); // Cannot mix BigInt and other types, use explicit conversions
// console.log(huge * BigInt(num)); // 46011856468256886179868n

// // EXCEPTIONS
// // Comparison operators
// console.log(20n > 15); // true
// console.log(20n === 20); // false - these values are different types of primitives
// console.log(20n == 20); // true

// // String concatinations
// console.log(huge + " is a large number"); // "2000515498619864616516 is a large number"


// // Divisions
// console.log(10n / 3n); // 3n - this cuts off the decimals
// console.log(10 / 3); // 3.3333333333333335





// /* ---- Creating Dates ---- */
// // Create a date - 4 methods
// // 1. Give current date and time
// let now = new Date();
// console.log(now); // The current time

// // 2. Based on Strings
// console.log(new Date("Thu Sep 01 2022 12:04:39")); // Thu Sep 01 2022 12:04:39 GMT+0100 (British Summer Time)
// console.log(new Date("December 24, 2015")); // Thu Dec 24 2015 00:00:00 GMT+0000 (Greenwich Mean Time)
// console.log(new Date(account1.movementsDates[0])); // Mon Nov 18 2019 21:31:17 GMT+0000 (Greenwich Mean Time)


// // 3. Based on Numbers - remember the months are 0 based so [0] = Jan, [11] = Dec
// console.log(new Date(2017, 10, 19, 15, 23, 5)); // Sun Nov 19 2017 15:23:05 GMT+0000 (Greenwich Mean Time)
// // JavaScript will also try to autocorrect dates - here it will automatically change to december as november only has 30 days
// console.log(new Date(2037, 10, 31)); // Tue Dec 01 2037 00:00:00 GMT+0000 (Greenwich Mean Time)

// // 4. Based on milliseconds since the start of the unix date (January 1st, 1970)
// console.log(new Date(0)); // Thu Jan 01 1970 01:00:00 GMT+0100 (Greenwich Mean Time)
// // Calculating 3 days later
// console.log(new Date(3 * 24 * 60 * 60 * 1000)); // Sun Jan 04 1970 01:00:00 GMT+0100 (Greenwich Mean Time)


// // Working with dates
// let future = new Date(2037, 10, 19, 15, 23);
// console.log(future); // Thu Nov 19 2037 15:23:00 GMT+0000 (Greenwich Mean Time)
// // Date Methods
// console.log(future.getFullYear()); // 2037
// console.log(future.getMonth()); // 10
// console.log(future.getDate()); // 19
// console.log(future.getDay()); // 4 - Which number of day in the week (Thurs is the 4th day)
// console.log(future.getHours()); // 15
// console.log(future.getMinutes()); // 23
// console.log(future.getSeconds()); // 0
// console.log(future.toISOString()); // "2037-11-19T15:23:00.000Z"

// // Calc Time Stamp
// console.log(future.getTime()); // 2142256980000 - Gives us the milliseconds from the epoch of unix.

// // Calc Time Stamp for now
// console.log(Date.now()); // 1662031213783

// // Set new information in a date
// future.setFullYear(2040);
// console.log(future); // Mon Nov 19 2040 15:23:00 GMT+0000 (Greenwich Mean Time)




// /* ---- Operations with Dates ---- */
// let future = new Date(2037, 10, 19, 15, 23);
// // Converting a date to a number returns us a timestamp
// console.log(+future); // 2142256980000

// let calcDaysPassed = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

// let days1 = calcDaysPassed(future, new Date(2037, 3, 14))
// console.log(days1); // 219.68




// /* ---- Internationalizing Numbers (INTL) ---- */
// // This will format the number as standard for each country.
// let num = 2884764.23;
// // This include formatting units
// // The option object has a number of possible properties
// let option = {
//   style: "currency",
//   unit: "celsius",
//   currency: "EUR",
//   // useGrouping: false
// }

// console.log("US:", new Intl.NumberFormat("en-US", option).format(num)); // 2,884,764.23
// console.log("UK:", new Intl.NumberFormat("en-UK", option).format(num)); // 2,884,764.23
// console.log("Germany:", new Intl.NumberFormat("de-DE", option).format(num)); // 2,884,764.23
// console.log("Syria:", new Intl.NumberFormat("ar-SY", option).format(num)); // ٢٬٨٨٤٬٧٦٤٫٢٣
// console.log(navigator.language, new Intl.NumberFormat(navigator.language, option).format(num)); // 2,884,764.23




// /* ---- TIMERS: setTimeout and setInterval ---- */
// setTimeout
// // setTimeout will have a call back function that will run after the given time in milliseconds
// setTimeout(() => console.log(`Here is your pizza`), 3000)
// // The code will continue to run and the setTimeout will execute once time is up so the "Waiting..." console log will appear first then the setTimeout
// console.log("Waiting...");
// // We can pass in arguments too by including them after the timer
// console.log(setTimeout((ing1, ing2) => console.log(`Here is your pizza with ${ ing1 } and ${ ing2 } `), 3000, "olives", "spinach"));

// // It is possible to cancel the time out with the clearTimeout() function
// let ingredients = ["olives", "spinach"]
// let pizzaTimer = setTimeout((ing1, ing2) => console.log(`Here is your pizza with ${ ing1 } and ${ ing2 } `), 3000, ...ingredients);

// if (ingredients.includes("spinach")) clearTimeout(pizzaTimer)


// // setInterval
// // Create a function to repeat based upon a timer set in milliseconds
// setInterval(function () {
//   let now = new Date();
//   console.log(`${ now.getHours() }:${ now.getMinutes() }.${ String(now.getSeconds()).padStart(2, 0) } `);
// }, 1000);