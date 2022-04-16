
// 使用するDOM
const todoItems = getDom(".todo-items", true);
const todoItems2 =getDom(".todo-items");
const editId =getDom("#edit");
const editTitleValue =getDom(".edit-title-value");
const editMainValue =getDom(".edit-main-value");
const editDate =getDom(".edit-date");
const btn =getDom("#add");
const todoRemove =getDom(".todo-remove");
const todoSave =getDom(".todo-save");
const closeButton =getDom("#close");
const todoComp =getDom(".todo-comp");
const todoWrapper = getDom(".todo-container");
const headerName = getDom(".header-name");
const todoName = getDom(".todo-name");
const addName = getDom(".add-container");
const editContainer = getDom(".edit-container");
const notificationContainer = getDom(".notification-container");
const notificationValue = getDom(".notification-value");
console.log(notificationValue.innerHTML);
const todoItemName = document.getElementsByClassName("todo-item-name");
const todoItem = document.getElementsByClassName("todo-item");
const todoDate = document.getElementsByClassName("todo-date");
const todoItemsId = document.getElementById("todo-items");

// global変数
let jsonTodoData;  // To Do Listのデータ
let dataId; // data ID
let headerNameNowColor;  // header name color

// load後 data取得し描画
window.addEventListener("load", getData);

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

// change color method
function domChangeWordColor(dom, setColor) {
  dom.animate(
    {
      color: setColor,
    },
    {
      duration: 300,
      fill: "forwards"
    }
  );
}

// change header name color
function changeColor() {
  let setColor;

  switch(headerNameNowColor) {
    case "red":
      setColor = ['red', 'blue'];
      headerNameNowColor = 'blue';
      break;
    case "blue":
      setColor = ['blue', 'green'];
      headerNameNowColor = 'green';
      break;
    case "green":
      setColor = ['green', 'pink'];
      headerNameNowColor = 'pink';
      break;
    default:
      setColor = ['#007bff', 'red'];
      headerNameNowColor = 'red';
  };
  domChangeWordColor(headerName, setColor);
  // for(const todo of todoItemName) {
  //   domChangeWordColor(todo, setColor);
  // }
  // domChangeWordColor(todoName, setColor);
  // domChangeWordColor(addName, setColor);
}
headerName.addEventListener("click", changeColor);


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
  for(let i = 0; i < jsonLen; i++) {
    const jsonTitle = jsonTodoData[i].title;
    const jsonMain = jsonTodoData[i].main;
    const jsonDate = jsonTodoData[i].date;
    const newTodo = jsonTodoData[i].comp
      ? createElementFromHTML(`<div class="todo-item unfinish-item"><input type="datetime-local" name="schedule" min="2000-01-01T00:00" max="2100-12-31T23:59" class="todo-date" value="${jsonDate}" /><span class="todo-item-name">${jsonTitle}</span><span class="completed active">完</span></div>`)
      : createElementFromHTML(`<div class="todo-item unfinish-item"><input type="datetime-local" name="schedule" min="2000-01-01T00:00" max="2100-12-31T23:59" class="todo-date" value="${jsonDate}" /><span class="todo-item-name">${jsonTitle}</span><span class="completed">完</span></div>`);
    todoItems[0].appendChild(newTodo);
    todoItemName[i].addEventListener("click", function() {
      editId.classList.add("active");
      editTitleValue.value = jsonTitle;
      editMainValue.value = jsonMain;
      editDate.value = jsonDate;
      dataId = i;
      todoWrapper.animate(
        {
          opacity: [0.5, 0.8],
        },
        {
          duration: 300,
        }
      );
    });
  }
}

// notification
function notify(val = '更新しました。') {
  notificationValue.innerHTML = val;
  notificationContainer.classList.add("active");
  setTimeout(() => {
    notificationContainer.animate(
      {
        opacity: [1, 0]
      },
      {
        duration: 700,
        fill: "forwards"
      }
      );
      setTimeout(() => {notificationContainer.classList.remove("active");}, 1000);
    }, 2500);
  notificationContainer.animate(
    {
      opacity: [0, 1]
    },
    {
      duration: 500,
      fill: "forwards"
    }
  );
}

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
    editId.classList.add("active");
    editTitleValue.value = jsonTitle;
    editMainValue.value = jsonMain;
    editDate.value = jsonDate;
    todoWrapper.animate(
      {
        opacity: [0.5, 0.8],
      },
      {
        duration: 300,
      }
    );
  })
  notify('カードを追加しました。');
});

// remove method
todoRemove.addEventListener("click", function() {
  jsonTodoData.splice(dataId, 1);
  const saveJsonData = JSON.stringify(jsonTodoData);
  localStorage.setItem("Todo", saveJsonData);
  todoItemsId.innerHTML = '';
  getData();
  editId.classList.remove("active");
  notify('削除しました。');
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
  editId.classList.remove("active");
  notify('保存しました。');
});

// complete method
todoComp.addEventListener("click", function(){
  const completedNode = document.getElementsByClassName("completed");
  completedNode[dataId].classList.add("active");
  jsonTodoData[dataId].comp = true;
  localStorage.setItem("Todo", JSON.stringify(jsonTodoData));
  todoItemsId.innerHTML = '';
  getData();
  editId.classList.remove("active");
  notify('完了しました。');
});

// close method
closeButton.addEventListener("click", function() {
  editId.classList.remove("active");
});

