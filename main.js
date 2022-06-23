const tasks = [];
let time = 0;
let timer  = null;
let timerBreak = null;
let current = null;
let statusApp = "stop";
                                               //referencia de mis elementos html         
const bAdd = document.querySelector("#bAdd"); //el querySelector devuelve el primer elemento dentro del doc que coincide con el selector que en este caso seria #bAdd
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");

renderTasks();
renderTime();

form.addEventListener('submit', e =>{ //le digo que se ejecute una funcion cuando se dispare el metodo de submit
    e.preventDefault();
    if(itTask.value !== ''){ 
        createTask(itTask.value);
        itTask.value = '';
        renderTasks();
    }
})

function createTask(value){
                              //aca coloco los elementos para mi arreglo de tasks
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(2),        //asi creamos un id dinamico, genera un valor entre 0 y 1. 0,1  0,2 etc
        title: value,                                              //ese resultado lo multiplica por 100 y a ese resultado lo transforma a la base 36 que le saco el 3
        completed: false,
    };

    tasks.unshift(newTask);//lo agrego a mi arreglo
}


function renderTasks() { //me permite tomar cada elemento de las tareas y generar un html que voy a inyectar en un contenedor
    const html = tasks.map((task) => { //transformo cada objeto en html
      return `
          <div class="task">
          <div class="completed">${
            task.completed
              ? "<span class='done'>Done</span>"
              : `<button class="start-button" data-id="${task.id}">Start</button></div>`
          }
              <div class="title">${task.title}</div> 
          </div>`;
    });
    const tasksContainer = document.querySelector("#tasks");
    tasksContainer.innerHTML = html.join("");//el metodo join es para transformar los elementos html en un solo string
  
    const startButtons = document.querySelectorAll(".task .start-button");
    startButtons.forEach((startButton) => {
      startButton.addEventListener("click", () => {
        if (!timer) {
          startButtonHandler(startButton.getAttribute("data-id"));
          startButton.textContent = "In progress...";
        }
      });
    });
  }
  
  function startButtonHandler(id) {
    time = 0.5 * 60;
    current = id;
    const taskId = tasks.findIndex((task) => task.id === id);
    document.querySelector("#time #taskName").textContent = tasks[taskId].title;
    timer = setInterval(() => {
      timerHandler(id);
    }, 1000);
  }
  
  function timerHandler(id = null) {
    time--;
    renderTime();
    if (time === 0) {
      markComplete(id);
      clearInterval(timer);
      renderTasks();
      startBreak();
    }
  }
  
  function markComplete(id) {
    const taskId = tasks.findIndex((task) => task.id === id);
    tasks[taskId].completed = true;
  }
  
  function startBreak() {
    time = 1 * 60;
    document.querySelector("#time #taskName").textContent = "Break";
    timerBreak = setInterval(timerBreakHandler, 1000);
  }
  
  function timerBreakHandler() {
    time--;
    renderTime();
    if (time === 0) {
      clearInterval(timerBreak);
      current = null;
      document.querySelector("#time #taskName").textContent = "";
      renderTime();
    }
  }
  
  function renderTime() {
    const timeDiv = document.querySelector("#time #value");
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);
    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }
 