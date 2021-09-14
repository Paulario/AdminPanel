'use strict';

const USERS = [];

let addUserForm = document.forms.addUserForm;
let userTable = document.querySelector('.users');

userTable.addEventListener('click', function(event){
    if(event.target.matches('input[name="delete"]')){
        let index = event.target.closest('tr').dataset.index;
        deleteUser(index);
        renderUserTable();
    }
    if(event.target.matches('input[name="edit"]')){
        let index = event.target.closest('tr').dataset.index;
        console.log(USERS[index]);
        editUser(USERS[index]);
        addUserForm.addUser.value = "Save Changes";
        addUserForm.addUser.name = "saveChanges";
        addUserForm.saveChanges.setAttribute('data-index', index);
        validateForm(addUserForm);
    }
});

addUserForm.addEventListener('click', function(event){
    if(event.target.matches('input[name="addUser"]')){
        let isValid = validateForm(addUserForm);
        if(isValid){
            USERS.push(getUserData());
            clearInputs();
            renderUserTable();
            for(const input of addUserForm.querySelectorAll('input.input')){
                input.classList.remove('is-valid', 'is-invalid');
            }
        }
    }
    if(event.target.matches('input[name="saveChanges"]')){
        let isValid = validateForm(addUserForm);
        let index = event.target.dataset.index;
        if(isValid){
            USERS[index] = getUserData();
            clearInputs();
            renderUserTable();
            addUserForm.addUser.value = "Add User";
            addUserForm.addUser.name = "addUser";
            for(const input of addUserForm.querySelectorAll('input.input')){
                input.classList.remove('is-valid', 'is-invalid');
            }
        }
    }
});

function getUserData(){
    let user = {};
    for(const input of document.querySelectorAll('input.input')){
        user[input.name] = input.value;
    }
    return user;
}

function renderUserTable(){
    let tbody = document.querySelector('.users tbody');
    renumberUsers();
    tbody.innerHTML = '';
    USERS.forEach(e => {
        tbody.insertAdjacentHTML('beforeend', 
            `
                <tr data-index="${e.N}">
                    <td>${e.N}</td>
                    <td>${e.login}</td>
                    <td>${e.email}</td>
                    <td>${e.password}</td>
                    <td><input type="button" name="edit" value="Edit"></td>
                    <td><input type="button" name="delete" value="Delete"></td>
                </tr>
            `);
        });
}

function validateForm(form){
    let tt, te, tp;
    tt = 'input[type="text"]';
    te = 'input[type="email"]';
    tp = 'input[type="password"]';
    let inputs = form.querySelectorAll(`${tt}, ${te}, ${tp}`);
    let allValid = true;
    for(const input of inputs){
        input.classList.remove('is-valid', 'is-invalid');
        let isValid;
        if(input.matches(tt)){
            isValid = isValidName(input.value);
        }
        if(input.matches(te)){
            isValid = isValidEmail(input.value);
        }
        if(input.matches(tp)){
            isValid = isValidPassword(input.value);
        }
        allValid &= isValid;
        if(isValid){
            input.classList.add('is-valid');
            input.nextElementSibling.classList.add('d-none');
        } else {
            input.classList.add('is-invalid');
            input.nextElementSibling.classList.remove('d-none');
        }
    }
    return allValid;
}

function deleteUser(index){
    USERS.splice(index, 1);
}

function editUser(user){
    addUserForm.login.value = user.login;
    addUserForm.email.value = user.email;
    addUserForm.password.value = user.password;
    
}

function isValidName(name){
    name = name.trim();
    let regExp = /^[A-Za-z]{3,18}$/;
    return regExp.test(name);
}

function isValidEmail(email){
    email = email.trim();
    let regExp = /^(\w+((\.|-)\w+)?\.?)+@(gmail|ukr)\.(ua|com|org|net)$/;
    return regExp.test(email);
}

function isValidPassword(password){
    let regExp = /^(\w|\s){8,255}$/;
    return regExp.test(password);
}

function renumberUsers(){
    let i = 0;
    USERS.forEach(e => {
        e.N = i;
        i++;
    });
}

function clearInputs(){
    addUserForm.login.value = '';
    addUserForm.email.value = '';
    addUserForm.password.value = '';
}
