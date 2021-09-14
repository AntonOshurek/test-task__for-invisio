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

function toStorage() {
  localStorage.setItem('tableList', JSON.stringify(tableList));
};

function absenceOfData() {
  if(tableList.length <= 0) {
    displayNoData();
  } else {
    displayTable();
  }
};

absenceOfData(); //checking for the presence of data in the array

addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (!addBrandInput.value || !addCarInput.value || !addYearInput.value) {
      addInputs.forEach(input => {
        if (!input.value) {
          input.classList.add('add-block__input--error');
          input.placeholder = 'Please enter a data';
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
});

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
};

function displayTable() {
  let displayTable = '';

  tableList.forEach(function(item, i) {
    displayTable += `
      <tr class="table__row">
        <th class="table__item table__item--car" scope="row">${item.brand}</th>
        <td class="table__item">${item.car}</td>
        <td class="table__item"> ${item.year}</td>
        <td class="table__item table__item--buttons">
          <button class="table__button standart-btn table__button--edit" type="button" data-edit-btn="${i}">edit</button>
          <button class="table__button standart-btn table__button--delete" type="button" data-delete-btn="${i}">delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML = displayTable;
  });
  deleteTableElem();
  editTable();
};

function deleteTableElem() {
  const tableDeleteBtn = document.querySelectorAll('.table__button--delete');

  tableDeleteBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      let btnIndex = e.target.getAttribute('data-delete-btn');
      tableList.splice(btnIndex, 1);
      toStorage();
      absenceOfData();
    })
  })
};

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
});

function sortUpCars(field) {
  return (a, b) => a[field] > b[field] ? 1 : -1;
};

function sortDownCars(field) {
  return (a, b) => a[field] < b[field] ? 1 : -1;
};

//edit and modal logick

const body = document.querySelector('.body');
const modal = document.querySelector('.modal');
const modalBg = document.querySelector('.modal__bg');
const modalBtn = document.querySelector('.modal__button');
const modalCloseBtn = document.querySelector('.modal__close-btn');

//modal inputs
const modalInputs = document.querySelectorAll('.modal__input');
const modalInputBrand = document.querySelector('.modal__input--brand');
const modalInputCar = document.querySelector('.modal__input--car');
const modalInputYear = document.querySelector('.modal__input--year');

function editTable() {
  const editBtn = document.querySelectorAll('.table__button--edit');
  editBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      modalOpen();

      let btnIndex = e.target.getAttribute('data-edit-btn');

      modalInputBrand.value = tableList[btnIndex].brand;
      modalInputCar.value = tableList[btnIndex].car;
      modalInputYear.value = tableList[btnIndex].year;

      addEditCar(btnIndex);
    })
  })
};

function addEditCar(btnIndex) {

  modalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!modalInputBrand.value || !modalInputCar.value || !modalInputYear.value) {
        modalInputs.forEach(input => {
          if (!input.value) {
            input.classList.add('modal__input--error');
            input.placeholder = 'Please enter a data';
            setTimeout(() => (input.classList.remove('modal__input--error')), 3000);
          }
        })
    } else {
        let newCar = {
          brand: modalInputBrand.value.toLowerCase(),
          car: modalInputCar.value.toLowerCase(),
          year: modalInputYear.value.toLowerCase()
        }

        tableList[btnIndex] = newCar;

        toStorage();
        displayTable();
        btnIndex ='';

        modalClose();
    }
  });

}

function modalOpen() {
  modal.classList.remove('modal--hidden');
  body.classList.add('body--scrolloff');
  modalInputBrand.focus();
  modalKeyOpt();
};

function modalClose(e) {
  e.preventDefault();
  modal.classList.add('modal--hidden');
  body.classList.remove('body--scrolloff');
};

modalBg.addEventListener('click', (e) => modalClose(e));
modalCloseBtn.addEventListener('click', (e) => modalClose(e));

function modalKeyOpt () {
  window.onkeydown = ( event ) => {
      if ( event.keyCode == 27 ) {
        modalClose(event);
      }
  };
};
