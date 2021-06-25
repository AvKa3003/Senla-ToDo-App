'use strict'
let AddText = document.querySelector('.addInput'),
    AddButton = document.querySelector('.addSubmit'),
    ToDo = document.querySelector('.todo'),
    TabsMenu = document.querySelector('.tabsMenu'),
    Search = document.querySelector('.searchInput'),
    ActiveTab = 0;

let todoList = [];

if (localStorage.getItem('todo')){
    todoList = JSON.parse(localStorage.getItem('todo'));
    showToDo();
}

Search.addEventListener('input', showToDo);

AddButton.addEventListener('click', function(event){
    event.preventDefault();
    addTodo();
    AddText.value = '';
});

function addTodo() {
    if (AddText.value != '' && isNotExist()) {

        let newToDo = {
            todo: AddText.value,
            checked: false,
            important: false
        };

        todoList.push(newToDo);
        showToDo();
    }
}

function isNotExist() {
    let status = true;
    todoList.forEach(
        function(item) {
            status = (status && (item.todo != AddText.value)) ? true : false;
        }
    );
    return status;
}

function getMessage(item, index) {
    if (item.important) {
        return `
            <li class="" id="itemid_${index}">
                <span class="isImportantSpan ${item.checked ? 'checked' : ''}">${item.todo}</span>
                <button class="todoButton deleteButton" onclick="return deleteItem('itemid_${index}');"><img src="./assets/images/delete.svg" alt="delete"></button>
                <button class="todoButton importantButton isImportant" onclick="return setImportant('itemid_${index}')">mark important</button>
            </li>
            `
        } else {
            return `
            <li class="" id="itemid_${index}">
                <span class="${item.checked ? 'checked' : ''}">${item.todo}</span>
                <button class="todoButton deleteButton"  onclick="return deleteItem('itemid_${index}');"><img src="./assets/images/delete.svg" alt="delete"></button>
                <button class="todoButton importantButton notImportant" onclick="return setImportant('itemid_${index}')">mark important</button>
            </li>
            `
        }
}

function showToDo() {
    let showMessage = '';
    todoList.forEach(function(item, index){
        if (Search.value === "" || item.todo.includes(Search.value)) {
            if (ActiveTab === 0) {
                showMessage += getMessage(item, index);
            } else if (ActiveTab === 1) {
                if (item.checked === false) {
                    showMessage += getMessage(item, index); 
                }
            } else if (ActiveTab === 2) {
                if (item.checked === true) {
                    showMessage += getMessage(item, index); 
                }
            }
        }
    });
    ToDo.innerHTML = showMessage;
    localStorage.setItem('todo', JSON.stringify(todoList))
}

function parseId(itemId) {
    return itemId.slice(itemId.indexOf('_')+1);
}

function setImportant(itemId) {
    itemId = parseId(itemId);
    todoList[itemId].important = !todoList[itemId].important;
    showToDo();
}

function deleteItem(itemId) {
    itemId = parseId(itemId);
    todoList.splice(itemId, 1);
    showToDo();
}

ToDo.addEventListener('contextmenu', (event) => {
    if (event.target.tagName === 'SPAN') {
        event.preventDefault();
        let itemId = event.target.closest('li').id;
        itemId = parseId(itemId);
        todoList[itemId].checked = !todoList[itemId].checked;
        showToDo();
    }
});

ToDo.addEventListener('dblclick', (event) => {
    if (window.matchMedia('(max-device-width: 500px)').matches) {
        if (event.target.tagName === 'SPAN') {
            event.preventDefault();
            let itemId = event.target.closest('li').id;
            itemId = parseId(itemId);
            todoList[itemId].checked = !todoList[itemId].checked;
            showToDo();
        }
    }
});


TabsMenu.addEventListener('click', (event) => {
    if (event.target.tagName === "LI") {

        document.querySelector('.activeTab').classList.remove('activeTab');
        document.querySelector('.tabsLine').classList.remove(`activeTab_${ActiveTab}`);
        let itemId = parseId(event.target.id);
        ActiveTab = +itemId;    
        document.querySelector('.tabsLine').classList.add(`activeTab_${ActiveTab}`);
        console.log(ActiveTab);
        document.getElementById(`tabIndex_${ActiveTab}`).classList.add('activeTab');
    }
    showToDo();
});

