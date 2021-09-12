const tableBody = document.querySelector('.table__body');
const tableEditBtn = document.querySelectorAll('.table__button');

//add new item for table elements
const addBtn = document.querySelector('.add-block__button');
//inputs
const addForm = document.querySelector('.add-block');
const addInputs = document.querySelectorAll('.add-block__input');
const addBrandInput = document.querySelector('.add-brand');
const addCarInput = document.querySelector('.add-car');
const addYearInput = document.querySelector('.add-year');

let tableList = []; //for all table elements

function checkStorage () {
  if(localStorage.getItem('tableList')) {
    tableList = JSON.parse(localStorage.getItem('tableList'));
    displayTable();
  }
};
checkStorage();

absenceOfData(); //checking for the presence of data in the array

function toStorage() {
  localStorage.setItem('tableList', JSON.stringify(tableList));
}

addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (!addBrandInput.value || !addCarInput.value || !addYearInput.value) {
      addInputs.forEach(input => {
        if (!input.value) {
          input.classList.add('add-block__input--error');
          setTimeout(() => (input.classList.remove('add-block__input--error')), 3000);
        }
      })
  } else {
      let newCar = {
        brand: addBrandInput.value.toLowerCase(),
        car: addCarInput.value.toLowerCase(),
        year: addYearInput.value.toLowerCase()
      }
      
      tableList.push(newCar);
      toStorage();
      addForm.reset(); //reset all inputs in add form
      displayTable();
  }
})

function absenceOfData() {
  if(tableList.length <= 0) {
    displayNoData();
  } else {
    displayTable();
  }
}

function displayNoData() {
  let displayTable = `
    <tr class="table__row">
      <th class="table__item table__item--car" scope="row">brak danych</th>
      <td class="table__item">brak danych</td>
      <td class="table__item">brak danych</td>
      <td class="table__item table__item--buttons">
        <button class="table__button standart-btn" type="button" disabled>edit</button>
        <button class="table__button standart-btn" type="button" disabled>delete</button>
      </td>
    </tr>
  `;
  tableBody.innerHTML = displayTable;
}

function displayTable() {
  let displayTable = '';

  tableList.forEach(function(item, i) {
    displayTable += `
      <tr class="table__row">
        <th class="table__item table__item--car" scope="row">${item.brand}</th>
        <td class="table__item">${item.car}</td>
        <td class="table__item"> ${item.year}</td>
        <td class="table__item table__item--buttons">
          <button class="table__button standart-btn" type="button" data-edit-btn="${i}">edit</button>
          <button class="table__button standart-btn" type="button" data-delete-btn="${i}">delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML = displayTable;
  });
  deleteTableElem();
};

function deleteTableElem() {
  const tableDeleteBtn = document.querySelectorAll('.table__button');

  tableDeleteBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      let btnIndex = e.target.getAttribute('data-delete-btn');
      tableList.splice(btnIndex, 1);
      toStorage();
      absenceOfData();
    })
  })
}

//sort logick

const sortUpBtn = document.querySelectorAll('.table__sort-button--upp');
const sortdownBtn = document.querySelectorAll('.table__sort-button--down');

sortUpBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    let sortAttribute = btn.getAttribute('data-sort-btn');

    tableList.sort(sortUpCars(sortAttribute));
    displayTable();
  })
});

sortdownBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    let sortAttribute = btn.getAttribute('data-sort-btn');

    tableList.sort(sortDownCars(sortAttribute));
    displayTable();
  })
})

function sortUpCars(field) {
  return (a, b) => a[field] > b[field] ? 1 : -1;
};

function sortDownCars(field) {
  return (a, b) => a[field] < b[field] ? 1 : -1;
};

/*tableList.sort(sortUpCars('brand'));
tableList.forEach(item => console.log(item.brand))
displayTable();*/
