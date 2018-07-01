let convert;
const currencyAPI = 'https://free.currencyconverterapi.com/api/v5/countries';
let currencyDropdown1 = document.querySelector('.js-currency1');
let currencyDropdown2 = document.querySelector('.js-currency2');
let converter1 = document.querySelector('.js-converter1');
let converter2 = document.querySelector('.js-converter2');
let ratio;
converter1.value = 1;

// Using Fetch API to get currency and country data from API
// Transforming the data into json
fetch(currencyAPI)
  .then((resp) => resp.json())
  .then((data) => {
    console.log('success country', data.results);
    let option;
    for (let curr in data.results) {
      option1 = document.createElement('option');
      option2 = document.createElement('option');
      option1.text = data.results[curr].currencyName;
      option2.text = data.results[curr].currencyName;
      option1.value = data.results[curr].currencyId;
      option2.value = data.results[curr].currencyId;
      if (curr == 'NG') {
        console.log('curr ', data.results[curr].currencyName);
        option1.setAttribute('selected', true);
      }
      if (curr == 'US') {
        console.log('curr ', data.results[curr].currencyName);
        option2.setAttribute('selected', true);
      }
      currencyDropdown1.add(option1);
      currencyDropdown2.add(option2);

    }
    getCurrencyRate();
  })


  // Catching Error and logging it if there is any error
  .catch((error) => console.log(`Error  ${error}`))

console.log('conveter ', converter1);

// window.addEventListener('keyup', playSound);

//Function  to get Input from User
getInput = (figure, userInput) => {
  console.log(figure, userInput, getCurrencyRate());

  if (userInput == 'v1') {
    converter2.value = figure * getCurrencyRate();
  }
  else if (userInput == 'v2') {
    console.log('Second', value);
  }
}

getCurrencyRate = (userInput) => {
  // Using Fetch API to get data from API
  let inputA, inputB
  if (userInput == "v2") {
    inputA = currencyDropdown2.value;
    inputB = currencyDropdown1.value;
  }
  else {
    inputA = currencyDropdown1.value;
    inputB = currencyDropdown2.value;
  }

  if (userInput == "v2") {
    convert = `https://free.currencyconverterapi.com/api/v5/convert?q=${inputA}_${inputB}&compact=ultra`;
  }
  else {
    convert = `https://free.currencyconverterapi.com/api/v5/convert?q=${inputA}_${inputB}&compact=ultra`;
  }
  // console.log('keys ', key1, key2);
  localforage
    .getItem(`${inputA}_${inputB}`)
    .then(ratio => {

      if (ratio) {
        //gets value from indexedDB and renders it
        console.log("Getting exchange rate from DB...");
        console.log('ratio ', ratio);
        if (!converter2.value) {
          converter2.value = ratio;
        }
        if (userInput == "v1") {
          converter2.value = converter1.value * ratio;
        }
        else if (userInput == "v2") {
          converter1.value = converter2.value * ratio;
        }
        else {
          converter2.value = converter1.value * ratio;
        }
      } else {
        fetch(convert)
          // Transforming the data into json
          .then((resp) => resp.json())
          .then((data) => {
            for (var prop in data) {
              ratio = data[prop];
            }
            localforage
              .setItem(`${inputA}_${inputB}`, ratio)
              .then(ratio => console.log(`Saved ${ratio} to DB`))
              .catch(err => console.log(err));
            console.log('ratio ', ratio);
            if (!converter2.value) {
              converter2.value = ratio;
            }
            if (userInput == "v1") {
              converter2.value = converter1.value * ratio;
            }
            else if (userInput == "v2") {
              converter1.value = converter2.value * ratio;
            }
            else {
              converter2.value = converter1.value * ratio;
            }
          })

          // Catching Error and logging it if there is any error
          .catch((error) => console.log(`Error  ${error}`));
      }
    });
}

getCurrencyRate();

