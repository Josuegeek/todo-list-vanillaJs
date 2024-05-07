const formCloser = document.getElementById("form-closer"),
    taskForm = document.getElementById("task-form"),
    formContainer = document.getElementById("form-container"),
    btnAddTask = document.getElementById("add-task-btn"),
    trashCloser = document.getElementById("trash-closer"),
    trashTableContainer = document.getElementById("trash-table-container"),
    trashContainer = document.getElementById("trash-container"),
    trashIcon = document.getElementById("trash-icon"),
    trashTable = document.getElementById("trash-task-table"),
    taskTbody = document.getElementById('task-tbody'),
    trashTbody = document.getElementById('trash-table-tbody'),
    searchBtn = document.getElementById("search-btn"),
    searchInput = document.getElementById("search-input"),
    filterSelect = document.getElementById("filter-select"),
    showTrashBtn = document.getElementById("show-trash-btn"),
    btnSubmit = document.getElementById("btn-submit"),
    reloadBtn = document.getElementById("reload-btn"),
    tasksTable = document.getElementById("task-table"),
    taskNameInput = document.getElementById("task-name"),
    taskDeadLineDateInput = document.getElementById("deadline"),
    taskDeadLineTimeInput = document.getElementById("deadline-time"),
    taskCheckInput = document.getElementById("task-check"),
    taskIdInput = document.getElementById("taskId");

let allTasks = [], removedTasks = [];

document.addEventListener("click", (event) => {
    const target = event.target;
    if (target == trashContainer) {
        hideTrash()
    }
});

//taskTbody.classList.add("invisible");
//console.log(showTrashBtn);
//taskDeadLineDateInput.value = "2024-05-05"

//fermeture du formulaire
formCloser.addEventListener("click", (e) => {
    hideForm();
});

reloadBtn.addEventListener("click", (e) => {
    loadTasks();
});

btnAddTask.addEventListener("click", (e) => {
    showFrom();
});

trashIcon.addEventListener("click", (e) => {
    showTrash();
});

showTrashBtn.addEventListener("click", (e) => {
    //console.log("click")
    showTrash();
});

trashCloser.addEventListener("click", (e) => {
    hideTrash();
});

searchBtn.addEventListener("click", (e) => {
    search(searchInput.value);
});

filterSelect.addEventListener("change", (e) => {
    let value = e.target.value;
    searchInput.value = "";

    switch (value) {

        case "fait":
            search("accomplie");
            break;
        case "rates":
            search("Passée");
            break;
        case "en-cours":
            search("en cours");
            break;
        default:
            search("");
            break;
    }
});

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let now = new Date();

    //const dateStr = taskDeadLineDateInput.value + " " + taskDeadLineTimeInput.value;
    //console.log(dateStr)
    //console.log(taskCheckInput.checked)
    const taskId = crypto.randomUUID(),
        name = taskNameInput.value,
        addDate = now,
        deadLine = new Date(taskDeadLineDateInput.value + " " + taskDeadLineTimeInput.value),
        statut = (taskCheckInput.checked) ? "Accomplie" : "En cours";

    const task = {
        taskId,
        name,
        addDate,
        deadLine,
        statut
    }

    if (btnSubmit.textContent.includes("Modifier")) {
        const gettedTaskId = taskIdInput.value;
        //const taskFind = allTasks.find(t => t.name == task.name);
        updateTask(gettedTaskId, task);
    }
    else {
        createTask(task);
    }
});

//fonction pour afficher le formulaire
function showFrom(taskId) {
    if (taskId) {
        const task = allTasks.find(t => t.taskId == taskId);
        if (task) {
            taskIdInput.value = taskId;
            taskNameInput.value = task.name;
            taskDeadLineDateInput.value = `${getFormatedDate(task.deadLine)}`;
            taskDeadLineTimeInput.value = task.deadLine.toLocaleTimeString();
            taskForm.classList.remove("invisible");
            taskForm.classList.add("show-form");
            formContainer.classList.add("form-container");
            btnSubmit.textContent = "Modifier la tâche";
        }
    }
    else {
        taskForm.reset();
        taskForm.classList.remove("invisible");
        taskForm.classList.add("show-form");
        formContainer.classList.add("form-container");
    }
}

//fonction pour cacher le formulaire
function hideForm() {
    taskForm.classList.remove("show-form");
    taskForm.classList.add("invisible");
    formContainer.classList.remove("form-container");
}

//fonction pour afficher la corbeille
function showTrash() {
    //console.log("showing trash")
    trashContainer.classList.add("trash-container");
    trashContainer.classList.remove("invisible");
    trashTableContainer.classList.remove("invisible");
    trashTableContainer.classList.add("trash-table-container");
}

//fonction pour cacher la corbeille
function hideTrash() {
    trashContainer.classList.remove("trash-container");
    trashContainer.classList.add("invisible");
    trashTableContainer.classList.add("invisible");
    trashTableContainer.classList.remove("trash-table-container");
}

//fonction pour recharger les tasks dans le tableau
function loadTasks() {
    //searchInput.value="";
    let num = 1;
    taskTbody.innerHTML = "";

    allTasks.forEach(task => {
        //console.log("adding tableau", task)
        addTasksToTasksTab(task, num, "tasks");
        num++;
    });
}

//fonction pour recharger les taches de la corbeille
function loadRemovedTasks(){
    let num = removedTasks.length;
    trashTbody.innerHTML = "";

    removedTasks.forEach(task => {
        //console.log("adding tableau", task)
        addTasksToTasksTab(task, num,"trash");
        num--;
    });
}

//fonction pour les recherchers
function search(mot) {
    mot = mot.toLowerCase();
    const rows = taskTbody.querySelectorAll('tr');
    //console.log("Searching", mot)
    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        let found = false;
        //row.classList.add("invisible");
        //console.log("cells", cells)
        if (mot == "") {
            //console.log("no Term");
            row.style.display = 'table-row';
        }
        else {
            cells.forEach(cell => {
                const cellText = cell.textContent.toLowerCase();
                //console.log(row, mot);
                if (cellText.includes(mot)) {
                    found = true;
                    //console.log("Found", row);
                    //row.style.display = found ? 'table-row' : 'noe';
                    //return;
                }
                row.style.display = found ? 'table-row' : 'none';
            });
        }

    });
}

//fonction de création d'un élément
function createElement(type, properties = {}) {
    const element = document.createElement(type);
    Object.assign(element, properties);
    return element;
}

//fonction de création d'un bouton
function createButton(text, clickHandler) {
    return createElement('button', {
        textContent: text,
        onclick: clickHandler
    });
}

//création d'une tâche et ajout de cette tâche dans le tableau
function createTask(task) {
    //console.log("Adding", task)
    if (allTasks.find(t => t.name == task.name)) {
        alert("Tâches Déja existente");
        return;
    }
    allTasks.push(task);
    loadTasks();
    hideForm();
    taskForm.reset();
}

//fonction d'ajout d'une tâche dans le tableau
function addTasksToTasksTab(taskObject, num, tab) {
    const taskId = taskObject.taskId;
    let statut = "Accomplie", statutClass = "status done";

    //gestion de l'affichage des statuts
    if (taskObject.statut != "Accomplie") {
        if (((taskObject.deadLine.getTime() - Date.now()) / (60000)) > 1) {
            statut = "En cours";
            statutClass = "status process";
        }
        else {
            statut = "Ratée"
            statutClass = "status late";
        }
    }

    const task = createElement('tr', {
        id: taskId
    });

    const taskIdTd = createElement('td', {
        id: `taskId${taskId}`,
        textContent: num
    });

    const taskNameTd = createElement('td', {
        id: `taskName${taskId}`,
        textContent: `${taskObject.name}`
    });

    const taskDateTd = createElement('td', {
        id: `taskDate${taskId}`,
        textContent: `${formatDateToShow(taskObject.addDate)}`
    });

    const taskDeadLineTd = createElement('td', {
        id: `taskDeadLine${taskId}`,
        textContent: `${taskObject.deadLine.toLocaleDateString()} à ${taskObject.deadLine.toLocaleTimeString()}`
    });

    const taskStatutTd = createElement('td', {
        innerHTML: `<div id="taskStatus${taskId}" class="${statutClass}">${statut}</div>`
    });

    let actionHtml = `<div class="row d-gap">
                        <i onclick="showFrom('${taskId}')" class="fa-regular fa-edit small-btn bg-primary-t"></i>
                        <i ${(statut != "Accomplie") ? `onclick="checkTask('${taskId}')" class="fa fa-check small-btn process""` : "class=\"fa fa-check small-btn\""}></i>
                        <i onclick="moveToTrash('${taskId}')" class="fa fa-trash small-btn"></i>
                    </div>`;
    
    if(tab=="trash"){
        actionHtml=`<div class="row d-gap">
                        <i onclick="restoreTask('${taskId}')" class="fa fa-rotate-left small-btn"></i>
                        <i onclick="removeTask('${taskId}')" class="fa fa-remove small-btn"></i>
                    </div>`
    }

    const taskControlsTd = createElement('td', {
        innerHTML: actionHtml
    });

    task.append(taskIdTd, taskNameTd, taskDateTd, taskDeadLineTd, taskStatutTd, taskControlsTd);

    if(tab=="tasks"){
        taskTbody.appendChild(task);
    }
    else{
        trashTbody.appendChild(task);
    }
    
    //console.log(taskTbody);
}

//update task
function updateTask(taskId, newTask) {
    const taskIndex = allTasks.findIndex(t => t.taskId == taskId);
    if (taskIndex >= 0) {
        allTasks[taskIndex].name = newTask.name;
        allTasks[taskIndex].deadLine = newTask.deadLine;
        allTasks[taskIndex].statut = newTask.statut;

        loadTasks();
        alert("modification reussie");
        hideForm();
    }
    else {
        alert("La tâche specifié est introuvable");
    }
}

//check task
function checkTask(taskId) {
    const taskIndex = allTasks.findIndex(t => t.taskId == taskId);
    console.log(taskIndex, taskId, allTasks);
    if (confirm("Noter cette tâche comme accomplie ?")) {
        if (taskIndex >= 0) {
            allTasks[taskIndex].statut = "Accomplie";

            loadTasks();
            hideForm();
        }
        else {
            alert("La tâche specifié est introuvable");
        }
    }

}

//move to trash
function moveToTrash(taskId) {
    if (confirm("Voulez-vous supprimer cette tâche?")) {
        const taskIndex = allTasks.findIndex(t => t.taskId == taskId);
        const task = allTasks.find(t => t.taskId == taskId);
        if (taskIndex>=0){
            allTasks.splice(taskIndex, 1);
            console.log(allTasks, taskIndex,allTasks.splice(taskIndex, taskIndex));
            removedTasks.unshift(task);
            loadTasks();
            loadRemovedTasks();
            alert("Tâche placée dans la corbeille");
        }
    }
}

//suppression definitive du task
function removeTask(taskId){
    if (confirm("Voulez-vous supprimer definitivement cette tâche?")) {
        const taskIndex = removedTasks.findIndex(t => t.taskId == taskId);
        const task = removedTasks.find(t => t.taskId == taskId);
        if (taskIndex>=0){
            removedTasks.splice(taskIndex, 1);
            //console.log(allTasks, taskIndex,allTasks.splice(taskIndex, taskIndex));
            //removedTasks.unshift(task);
            //loadTasks();
            loadRemovedTasks();
            alert("Tâche Supprimée definitivement");
        }
    }
}

//retaurer la tâche
function restoreTask(taskId) {
    if (confirm("Voulez-vous retaurer cette tâche?")) {
        const taskIndex = removedTasks.findIndex(t => t.taskId == taskId);
        const task = removedTasks.find(t => t.taskId == taskId);
        if (taskIndex>=0){
            removedTasks.splice(taskIndex, 1);
            //console.log(allTasks, taskIndex,allTasks.splice(taskIndex, taskIndex));
            allTasks.push(task);
            console.log(allTasks)
            loadTasks();
            loadRemovedTasks();
            alert("Tâche restaurée avec success");
        }
    }
}

//Avoir la difference des dates en heures
function getDifferenceInHour(date) {
    const differenceEnMillisecondes = Date.now() - date.getTime();
    const differenceEnHeure = Math.floor(differenceEnMillisecondes / (1000 * 60 * 60));
    return differenceEnHeure;
}

//Avoir la difference des dates en minutes
function getDifferenceInMinutes(date) {
    const differenceEnMillisecondes = Date.now() - date.getTime();
    //console.log("Comparaison entre ", date.getTime(), Date.now());
    const differenceEnMinutes = Math.floor(differenceEnMillisecondes / (1000 * 60));
    return differenceEnMinutes;
}

//Avoir la difference des dates en seconde
function getDifferenceInSecond(date) {
    const differenceEnMillisecondes = Date.now() - date.getTime();
    const differenceEnSeconde = Math.floor(differenceEnMillisecondes / 1000);
    return differenceEnSeconde;
}

//Avoir la difference des dates en jour
function getDifferenceInDay(date) {
    const differenceEnMillisecondes = Date.now().toLo - date.getTime();
    const differenceEnJour = Math.floor(differenceEnMillisecondes / (1000 * 60 * 60 * 24));
    return differenceEnJour;
}

//formatter le texte de date
function formatDateToShow(date) {
    let formatedDateString = "";
    if (getDifferenceInDay(date) >= 1) {
        formatedDateString = `il y a ${getDifferenceInDay(date)} jour(s)`;
    }
    else if (getDifferenceInHour(date) >= 1) {
        formatedDateString = `il y a ${getDifferenceInHour(date)} heure(s)`;
    }
    else if (getDifferenceInMinutes(date) >= 1) {
        formatedDateString = `il y a ${getDifferenceInMinutes(date)} minute(s)`;
    }
    else {
        formatedDateString = `il y a ${getDifferenceInSecond(date)} seconde(s)`;
    }
    return formatedDateString;
}

function getFormatedDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}`;
}

//timer pour actualiser les tasks automatiquement
setInterval(function () {
    //console.log("Fonction seconde")
    loadTasks();
    loadRemovedTasks();
}, 10000);