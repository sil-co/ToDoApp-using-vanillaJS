
// dom取得関数
function getDom(attrName, all = false) {
  let dom;
  if(all) {
    dom = document.querySelectorAll(attrName);
  } else {
    dom = document.querySelector(attrName);
  }
  return dom;
}

// 使用するDOM
const todoItems = document.getElementsByClassName("todo-items");
const todoItems2 =getDom(".todo-items");
const todoItemName = document.getElementsByClassName("todo-item-name");
const todoItem = document.getElementsByClassName("todo-item");
const editContainer =getDom("#edit");
const todoDate = document.getElementsByClassName("todo-date");
const editTitleValue =getDom(".edit-title-value");
const editMainValue =getDom(".edit-main-value");
const editDate =getDom(".edit-date");
const btn =getDom("#add");
const todoRemove =getDom(".todo-remove");
const todoSave =getDom(".todo-save");
const todoItemsId = document.getElementById("todo-items");
const closeButton =getDom("#close");
const todoComp =getDom(".todo-comp");


// global変数
let jsonTodoData;  // To Do Listのデータ
let dataId;

// html文字列をnode形式に変換する関数
function createElementFromHTML(html) {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = html;
  return newDiv.firstElementChild;
}

// データを取得し描画する関数
function getData() {
  jsonTodoData = localStorage.getItem("Todo");
  if (jsonTodoData === null) {
    jsonTodoData = [
      {
        title: "新規",
        main: "",
        date: "",
        comp: false
      },
    ];
    jsonTodoData = JSON.stringify(jsonTodoData);
    localStorage.setItem("Todo", jsonTodoData);
  }
  jsonTodoData = JSON.parse(jsonTodoData);
  const jsonLen = Object.keys(jsonTodoData).length;
  console.log(jsonLen);
  for(let i = 0; i < jsonLen; i++) {
    const jsonTitle = jsonTodoData[i].title;
    const jsonMain = jsonTodoData[i].main;
    const jsonDate = jsonTodoData[i].date;
    const newTodo = jsonTodoData[i].comp
      ? createElementFromHTML(`<div class="todo-item unfinish-item"><input type="datetime-local" name="schedule" min="2000-01-01T00:00" max="2100-12-31T23:59" class="todo-date" value="${jsonDate}" /><span class="todo-item-name">${jsonTitle}</span><span class="completed active">完</span></div>`)
      : createElementFromHTML(`<div class="todo-item unfinish-item"><input type="datetime-local" name="schedule" min="2000-01-01T00:00" max="2100-12-31T23:59" class="todo-date" value="${jsonDate}" /><span class="todo-item-name">${jsonTitle}</span><span class="completed">完</span></div>`);
    todoItems[0].appendChild(newTodo);
    todoItemName[i].addEventListener("click", function() {
      editContainer.classList.add("active");
      editTitleValue.value = jsonTitle;
      editMainValue.value = jsonMain;
      editDate.value = jsonDate;
      dataId = i;
    });
  }
}

// load後 data取得し描画
window.addEventListener("load", getData);

// add card method
btn.addEventListener("click", function() {
  const addTodo = document.querySelector(".add-todo");
  const newTodo = createElementFromHTML('<div class="todo-item unfinish-item"><input type="datetime-local" name="schedule" min="2000-01-01T00:00" max="2100-12-31T23:59" class="todo-date" /><span class="todo-item-name">新規</span><span class="completed">完</span></div>');
  addTodo.appendChild(newTodo);
  jsonTodoData.push(
    {
      title: "新規",
      main: "",
      date: "",
      comp: false
    },
  );
  const saveJsonData = JSON.stringify(jsonTodoData);
  localStorage.setItem("Todo", saveJsonData);
  const jsonLen = Object.keys(jsonTodoData).length -1;
  todoItemName[jsonLen].addEventListener("click", function() {
    const jsonTitle = jsonTodoData[jsonLen].title;
    const jsonMain = jsonTodoData[jsonLen].main;
    const jsonDate = jsonTodoData[jsonLen].date;
    editContainer.classList.add("active");
    editTitleValue.value = jsonTitle;
    editMainValue.value = jsonMain;
    editDate.value = jsonDate;
  })
});

// remove method
todoRemove.addEventListener("click", function() {
  jsonTodoData.splice(dataId, 1);
  const saveJsonData = JSON.stringify(jsonTodoData);
  localStorage.setItem("Todo", saveJsonData);
  todoItemsId.innerHTML = '';
  getData();
  editContainer.classList.remove("active");
});

// save method
todoSave.addEventListener("click", function() {
  console.log(editTitleValue.value);
  const saveData = {
    title: editTitleValue.value,
    main: editMainValue.value,
    date: editDate.value,
    comp: jsonTodoData[dataId].comp
  };
  jsonTodoData[dataId] = saveData;
  const saveJsonData = JSON.stringify(jsonTodoData);
  localStorage.setItem("Todo",saveJsonData);
  todoItemsId.innerHTML = '';
  getData();
  editContainer.classList.remove("active");
});

// complete method
todoComp.addEventListener("click", function(){
  const completedNode = document.getElementsByClassName("completed");
  completedNode[dataId].classList.add("active");
  jsonTodoData[dataId].comp = true;
  localStorage.setItem("Todo", JSON.stringify(jsonTodoData));
  todoItemsId.innerHTML = '';
  getData();
  editContainer.classList.remove("active");
});

// close method
closeButton.addEventListener("click", function() {
  editContainer.classList.remove("active");
});

