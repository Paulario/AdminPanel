function $(selector) {
    return document.querySelector(selector);
}
const USERS = (function () {
    let _USERS = [];
    function _renumberUsers() {
        let i = 0;
        _USERS.forEach(e => {
            e.N = i;
            i++;
        });
    }
    function add(user) {
        _USERS.push(user);
        _renumberUsers();
    }
    function remove(index) {
        _USERS.splice(index, 1);
        _renumberUsers();
    }
    function edit(index, newUser) {
        let user = _USERS[index];
        for (let key of Object.keys(newUser)) {
            if (newUser[key]) {
                console.log('here');
                user[key] = newUser[key];
            }
        }
    }
    function get(index) {
        let copy = [];
        if (index) {
            copy = _USERS[+index];
        }
        else {
            for (const user of _USERS) {
                copy.push(Object.assign({}, user));
            }
        }
        return copy;
    }
    return {
        edit: edit,
        remove: remove,
        get: get,
        add: add,
    };
})();
const CHECKER = {
    LOGIN: function (name) {
        name = name.trim();
        let regExp = /^[A-Za-z]{3,18}$/;
        return regExp.test(name);
    },
    EMAIL: function (email) {
        email = email.trim();
        let regExp = /^(\w+((\.|-)\w+)?\.?)+@(gmail|ukr)\.(ua|com|org|net)$/;
        return regExp.test(email);
    },
    PASSWORD: function (password) {
        let regExp = /^(\w|\s){8,255}$/;
        return regExp.test(password);
    }
};
let addUserForm = document.forms['addUserForm'];
let userTable = $('.users');
userTable.addEventListener('click', function (event) {
    let target = event.target;
    if (target.matches('input[name="delete"]')) {
        let index = target.closest('tr').dataset.index;
        USERS.remove(index);
        renderUserTable();
    }
    if (target.matches('input[name="edit"]')) {
        let index = target.closest('tr').dataset.index;
        console.log('index =>', index);
        fillInForm(USERS.get(index));
        addUserForm.addUser.value = "Save Changes";
        addUserForm.addUser.name = "saveChanges";
        addUserForm.saveChanges.setAttribute('data-index', index);
        validateForm(addUserForm);
    }
});
addUserForm.addEventListener('click', function (event) {
    let target = event.target;
    if (target.matches('input[name="addUser"]')) {
        let isValid = validateForm(addUserForm);
        if (isValid) {
            USERS.add(getUserData());
            clearInputs();
            renderUserTable();
            for (const input of addUserForm.querySelectorAll('input.input')) {
                input.classList.remove('is-valid', 'is-invalid');
            }
        }
    }
    if (target.matches('input[name="saveChanges"]')) {
        let isValid = validateForm(addUserForm);
        let index = target.dataset.index;
        if (isValid) {
            console.log(getUserData());
            console.log('index =>', index);
            USERS.edit(index, getUserData());
            renderUserTable();
            addUserForm.addUser.value = "Add User";
            addUserForm.addUser.name = "addUser";
            clearInputs();
            for (const input of addUserForm.querySelectorAll('input.input')) {
                input.classList.remove('is-valid', 'is-invalid');
            }
        }
    }
});
function getUserData() {
    let user = {
        login: $('.input[name="login"]').value,
        email: $('.input[name="email"]').value,
        password: $('.input[name="password"]').value,
    };
    return user;
}
function renderUserTable() {
    let tbody = document.querySelector('.users tbody');
    tbody.innerHTML = '';
    USERS.get().forEach(e => {
        tbody.insertAdjacentHTML('beforeend', `
                 <tr data-index="${e.N}">
                 <td>${e.N + 1}</td>
                 <td>${e.login}</td>
                 <td>${e.email}</td>
                 <td>${e.password}</td>
                 <td><input type="button" name="edit" value="Edit"></td>
                 <td><input type="button" name="delete" value="Delete"></td>
                 </tr>
             `);
    });
}
function validateForm(form) {
    let tt, te, tp;
    tt = 'input[type="text"]';
    te = 'input[type="email"]';
    tp = 'input[type="password"]';
    let inputs = form.querySelectorAll(`${tt}, ${te}, ${tp}`);
    let allValid = true;
    for (const input of inputs) {
        input.classList.remove('is-valid', 'is-invalid');
        let isValid;
        if (input.matches(tt)) {
            isValid = CHECKER.LOGIN(input.value);
        }
        if (input.matches(te)) {
            isValid = CHECKER.EMAIL(input.value);
        }
        if (input.matches(tp)) {
            isValid = CHECKER.PASSWORD(input.value);
        }
        allValid &&= isValid;
        if (isValid) {
            input.classList.add('is-valid');
            input.nextElementSibling.classList.add('d-none');
        }
        else {
            input.classList.add('is-invalid');
            input.nextElementSibling.classList.remove('d-none');
        }
    }
    return allValid;
}
function clearInputs() {
    addUserForm.login.value = '';
    addUserForm.email.value = '';
    addUserForm.password.value = '';
}
function fillInForm(user) {
    addUserForm.login.value = user.login;
    addUserForm.email.value = user.email;
    addUserForm.password.value = user.password;
}
