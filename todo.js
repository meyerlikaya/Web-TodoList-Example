//Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners(); // Sayfa ilk açıldığında tüm eventler çalışıcak.

function eventListeners() {
  // Tüm event Listenerlar
  form.addEventListener("submit", addTodo);
  window.addEventListener("load", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click",clearAllTodos);
}

function clearAllTodos(){
  if(confirm("Tüm Todoları silmek istediğinize emin misiniz?")){
    //Arayüzden Todo Temizleme
    while(todoList.firstElementChild != null){
      todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos");
  }
}

function filterTodos(e){
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item ");
  
  listItems.forEach(function(listItem){
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1) {
      //Bulamadı
      listItem.setAttribute("style", "display: none !important");
    }
    else{
      listItem.setAttribute("style", "display: block");
    }

  });
}

function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    deleteTodosFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "Todo Başarıyla Silindi.");
  }
}
function deleteTodosFromStorage(deleteTodo) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === deleteTodo) {
      todos.splice(index, 1); // Splice arrayden değer silmeye yarar.
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}
function addTodo(e) {
  const newTodo = todoInput.value.trim(); //Trim fonksiyonu girilen inputda boşluk bırakılarak girildiğinde boşlukları silmesi için kullandık.
  if (newTodo === "") {
    showAlert("danger", "Lütfen bir todo giriniz!");
  } else {
    addTodoToUI(newTodo); //Todo arayüz listesinde görünmesi için oluşturulan fonksiyon.
    addTodoToStorage(newTodo);
    showAlert("success", "Todo başarıyla eklendi...");
  }

  e.preventDefault(); // Submit sonrası form tekrar yüklenmesin diye kullandığımız metot.
}
function getTodosFromStorage() {
  // Storage' dan Todoları Alma.
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  firstCardBody.appendChild(alert);
  // setTimeOut objesi alert mesajını belirlenen süre sonunda kaldırmaya yarar.
  setTimeout(function () {
    alert.remove();
  }, 2000);
}

function addTodoToUI(newTodo) {
  //String değerini list item olarak UI' ya ekliyecek.
  /*
    <!-- <li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>

                        </li>--> */ // Örnek liste tasarımı

  // List item oluşturma
  const listItem = document.createElement("li");
  //Link oluşturma
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class = 'fa fa-remove'></i>";

  listItem.className = "list-group-item d-flex justify-content-between";
  // Text Node Ekleme
  listItem.appendChild(document.createTextNode(newTodo));
  //Link' i ekleme
  listItem.appendChild(link);

  // Todo List' e List Item' ı ekleme
  todoList.appendChild(listItem);
  // Todo Ekleme input' unu submit ettikten sonra kutunun boşalması için.
  todoInput.value = "";
}
