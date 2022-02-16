//get HTMLElement
let section = document.querySelector("section");    
let add = document.querySelector("form button");  

//create addButton
add.addEventListener("click", (e) => {

    e.preventDefault(); //防止Button Element丟出導致程式出問題

    let form = e.target.parentElement;  //get form Element
    let todoText = form.children[0].value;  //待辦事項文字
    let todoMonth = form.children[1].value; //待辦事項月份
    let todoDate = form.children[2].value;  //待辦事項日期

    //待辦事項文字未輸入時跳出通知
    if (todoText === "") { 
        alert("Please Enter some Text.");
        return;
    }

    //創建待辦事項輸出文字的HTMLElement及對應Class
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + " / " + todoDate;

    //將兩個 p Element 併入div Element內
    todo.appendChild(text);
    todo.appendChild(time);
    //將div Element 併入section內
    section.appendChild(todo);

    //create completeButton, Class為complete 
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';

    completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;  //get div Element
        todoItem.classList.toggle("done");  //toggle重複點擊後復歸按鈕功能
    });

    todo.style.animation = "scaleUp 0.3s forwards";  //待辦事項輸出文字比例放大動畫 0.3s

    //create trashButton, Class為trash
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");  
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;  //get div Element
        todo.style.animation = "scaleDown 0.3s forwards";   //待辦事項輸出文字比例縮小動畫 0.3s

        //等待動畫結束後觸發
        todoItem.addEventListener("animationend", () => {
          //remove from local storage
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));

          myListArray.forEach((item, index) => { 
              if (item.todoText == text) {
                  myListArray.splice(index, 1); //從item[index]刪除1個元素
                  localStorage.setItem("list", JSON.stringify(myListArray));  //重設刪除後localStorage 的 list
              }
          });
          todoItem.remove();
      });
    });

    //將兩Button併入待辦事項輸出文字之div內
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    //按下add Button後清空輸入欄位
    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";

    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate,
    };

    let mylist = localStorage.getItem("list");
    if (mylist == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let myListArray = JSON.parse(mylist); //變回object
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));
});

loadData(); //須先執行一次

function loadData() {
    let mylist = localStorage.getItem("list");
    if (mylist !== null) {
        let myListArray = JSON.parse(mylist);
        myListArray.forEach((item) => {
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = item.todoMonth + " / " + item.todoDate;
            todo.appendChild(text);
            todo.appendChild(time);
            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
            completeButton.addEventListener("click", (e) => {
                let todoItem = e.target.parentElement;
                todoItem.classList.toggle("done");
            });

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
            trashButton.addEventListener("click", (e) => {
              let todoItem = e.target.parentElement;
              todo.style.animation = "scaleDown 0.3s forwards";
              todoItem.addEventListener("animationend", () => {
                //remove from local storage
                let text = todoItem.children[0].innerText;
                let myListArray = JSON.parse(localStorage.getItem("list"));
                myListArray.forEach((item, index) => { //forEach(Array, index)
                    if (item.todoText == text) {
                        myListArray.splice(index, 1);
                        localStorage.setItem("list", JSON.stringify(myListArray));
                    }
                });
                todoItem.remove();
              });
            });
            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            section.appendChild(todo);
        });
    }
}

//Merge Sort 待辦日期排序
function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        //比較"月份"
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            //比較"日期"
            if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
                result.push(arr2[j]);
                j++;
            } else {
                result.push(arr1[i]);
                i++;
            }
        }
    }
    //把沒比較到的數值皆丟入result
    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }

    return result; 
}

function mergeSort(arr) {
    if (arr.length === 1) {  //做到長度餘1時輸出
        return arr;
    } else {
        //切成兩等分，不包含middle這個點
        let middle = Math.floor(arr.length / 2);  //(Math.floor去小數的整數)  
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left)); //遞迴
    }
}

//create sortButton
let sortButton = document.querySelector("div.sort button");  //get button Element in div.sort

sortButton.addEventListener("click", () => {
    //sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    //remove data
    let len = section.children.length; //產生HTMLCelection，不可使用forEach
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    //load data
    loadData();
});
