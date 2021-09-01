const secrets = document.querySelectorAll(".secret");
const titleEdit = document.querySelector('#titleEdit');
const textEdit = document.querySelector('#textEdit');
const boxes = document.querySelectorAll('.beatBox');
const mainBox = document.querySelector('.mainBox');
const nav = document.getElementById('nav');
let cards = [];
let lines = [];
let loadList = {};
let lineKeepList = [];

//load saved shit, if shit not found spawn blank first card
initLoad();


function initLoad() {
    loadList = JSON.parse(localStorage.getItem('myStoryItems'));
    loadLinesList = JSON.parse(localStorage.getItem('myStoryLineItems'));
    // console.log("LINES LIST: ", loadLinesList);
    if (loadList === null) {
        spawnBox();
        return;
    }
    loadList.forEach(item => loadBox(item))
    secondaryLineLoad();
}
function secondaryLineLoad() {
    if (loadLinesList === null) {
        console.log('no lines found')
    } else {
        loadLinesList.forEach(item => {
            loadLines(item);
            // console.log("this line is: ", item)
        });
    }
}

function string_to_array(str) {
    return str.trim().split(" ");
};

function loadBox(object) {
    let nuBox = document.createElement('div');
    nuBox.innerHTML = object.innerHTML;
    let nuId = object.id;
    nuBox.id = nuId;
    nuBox.style = object.style;
    console.log(object.classes);
    let classes = object.classes;
    let classArray = string_to_array(classes);
    classArray.forEach(clas => {
        nuBox.classList.add(clas)
    })
    // nuBox.classList.add('beatBox');
    makeDraggable(nuBox);
    mainBox.append(nuBox);
    draggable = new PlainDraggable(nuBox);
    draggable.autoScroll = true;
    draggable.onMove = function () {
        fixLine();
    }
    cards.push(nuBox);
}


function saveChanges() {
    // console.log(isSelected.firstElementChild.textContent);
    isSelected.firstElementChild.textContent = titleEdit.value;
    isSelected.childNodes[1].innerText = textEdit.value;
}
let saveList = [];
let lineList = [];
function saveAll() {
    saveList = [];
    lineList = [];
    cards.forEach(item => {
        // console.log(item);
        // console.log(item.innerHTML);
        // console.log(item.attributes);
        // console.log("ID= ", item.attributes.id);
        // console.log("ID VALUE= ", item.attributes.id.value);
        console.log("classes= ", item.attributes.class.value);
        saveList.push(new storyBoxInfo(item.attributes.id.value, item.attributes.class.value, item.attributes.style.value, item.innerHTML));
    });
    saveLines();
    localStorage.setItem('myStoryItems', JSON.stringify(saveList));
    // localStorage.setItem('myStoryLineItems', JSON.stringify(lineList));
}

class storyBoxInfo {
    constructor(id, classes, style, innerHTML) {
        this.id = id;
        this.classes = classes;
        this.style = style;
        this.innerHTML = innerHTML;
    };
}

//card constructor funtion- makes new card with unique ID
function spawnBox() {
    let nuBox = document.createElement('div');
    let nuNode = document.createElement('div');
    let nuNode2 = document.createElement('div');
    let nuNode3 = document.createElement('div');
    let nuTit = document.createElement('h2');
    let nuText = document.createElement('p');
    let nuId = cards.length + 1;
    nuNode.classList.add('lineNode');
    nuNode.classList.add('left');
    nuNode2.classList.add('lineNode');
    nuNode2.classList.add('right');
    nuBox.id = nuId;
    nuNode3.classList.add('label');
    nuNode3.textContent = nuId;
    nuBox.classList.add('beatBox');
    nuBox.append(nuTit, nuText);
    nuBox.append(nuNode, nuNode2, nuNode3);
    makeDraggable(nuBox);
    mainBox.append(nuBox);
    draggable = new PlainDraggable(nuBox);
    draggable.autoScroll = true;
    draggable.onMove = function () {
        fixLine();
    }
    cards.push(nuBox);
    // console.log(cards.length);
}

//selected card-- if card selected, display card info 
let isSelected;

function select(thisCard) {
    cards.forEach(card => card.classList.remove('selected'))
    isSelected = thisCard;
    thisCard.classList.add('selected');
}

//delete box function that removes box, finds all lines with box id and removes them as well
function deleteBox() {
    removeLines(isSelected.id);
    isSelected.remove();
}


//save start line point to a node, save end line point to a node, update to new positions when dragging
function makeDraggable(card) {
    card.addEventListener("mousedown", function (e) {
        select(e.currentTarget);
        // console.log(e.currentTarget.childNodes[1].innerText);
        titleEdit.value = e.currentTarget.firstElementChild.textContent;
        textEdit.value = e.currentTarget.childNodes[1].innerText;
    })
}
let startPoint;
let endPoint;

function makeOldLine(startpoint, endpoint) {
    if (startpoint && endpoint !== "") {
        let line = new LeaderLine(startpoint, endpoint);
        line.color = 'rgb(0, 255, 0)';
        lines.push(line)
        storeOldLine(startpoint, endpoint);
        return lines;
    } else console.log("somethings fucked in the makeline, no startpoint, endpoint found")
}
function makeLine(startpoint, endpoint) {
    if (startpoint && endpoint !== "") {
        let line = new LeaderLine(startpoint, endpoint);
        line.color = 'rgb(0, 255, 0)';
        lines.push(line)
        storeLine(startpoint, endpoint);
        return lines;
    } else console.log("somethings fucked in the makeline, no startpoint, endpoint found")
}
function fixLine() {
    lines.forEach(line =>
        line.position()
    )
}

cards.forEach(card => makeDraggable(card))
let lineIdNum1;
let lineIdNum2;
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('lineNode') && e.ctrlKey) {
        startPoint = "";
        endPoint = "";
        startPoint = e.target;
        lineIdNum1 = e.target.parentElement.id;
        return startPoint, lineIdNum1;
    }
})
function makeId(num1, num2) {
    let ID = toString(num1) + toString(num2);
    return ID;
};
function storeLine(start, end) {
    let ID = lineIdNum1 + "x" + lineIdNum2;
    // console.log("storline start obj: ", start);
    // console.log("storline end obj: ", end);
    lineKeepList.push([ID, start, end]);
};
function storeOldLine(start, end) {
    // console.log("oldstorline start obj: ", start);
    // console.log("oldstorline end obj: ", end);
    // console.log("oldstorline ID: ", start.parentElement.id + "x" + end.parentElement.id);
    let ID = start.parentElement.id + "x" + end.parentElement.id;
    lineKeepList.push([ID, start, end]);
};
function removeLines(leId) {
    for (let i = 0; i < lineKeepList.length; i++) {
        let string = lineKeepList[i][0];
        if (string.includes(leId)) {
            console.log('DELETING LINE', lineKeepList[i]);
            lineKeepList.splice(i, 1);
        }
    };
};
function saveLines() {
    localStorage.setItem('myStoryLineItems', JSON.stringify(lineKeepList));
    console.log(lineKeepList);
};

function loadLines(array) {
    var numberPattern = /\d+/g;
    let divId0 = String(array[0].match(numberPattern)[0]);
    let divId2 = String(array[0].match(numberPattern)[1]);
    // console.log(divId0, " and ", divId2);
    let div0 = document.getElementById(divId0);
    let div2 = document.getElementById(divId2);
    // console.log(div0, " ANNND ", div2)
    let div0children = div0.childNodes;
    let div2children = div2.childNodes;
    // console.log(div0children, " annnnnnd ", div2children)
    div0children.forEach(child => {
        if (child.classList.contains('right')) {
            div0 = child;
            return div0;
        }
    })
    div2children.forEach(child => {
        if (child.classList.contains('left')) {
            div2 = child;
            return div2;
        }
    })
    // console.log(div0, " and ", div2);
    makeOldLine(div0, div2);
}
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('lineNode') && !e.ctrlKey && startPoint !== "") {
        endPoint = e.target;
        // console.log("start line triggered ", startPoint, "AND end line triggered ", endPoint);
        lineIdNum2 = e.target.parentElement.id;
        makeLine(startPoint, endPoint);
        return lineIdNum2;
    }
})

boxes.forEach(box => {
    draggable = new PlainDraggable(box);
    draggable.autoScroll = true;
})

//sidenav close open

function toggleNav() {
    if (nav.style.width === "5vw") {
        openNav();
    } else if (nav.style.width === "35vw") {
        closeNav();
    }
}
function openNav() {
    document.getElementById("nav").style.width = "35vw";
    document.querySelector(".open").style.visibility = "hidden"
    secrets.forEach(secret =>
        secret.style.visibility = 'visible')
};
function closeNav() {
    document.getElementById("nav").style.width = "5vw";
    document.querySelector(".open").style.visibility = "initial"
    secrets.forEach(secret =>
        secret.style.visibility = 'hidden')
};

nav.addEventListener('click', function (e) {
    if (!e.target.classList.contains('out')) {
        toggleNav();
    }
})

//export all -copy to clipboard

let exportList
function concatinate() {
    exportList = [];
    cards.forEach(item => {
        // console.log(item);
        // console.log(item.innerText);
        // console.log(item.attributes);
        // console.log("ID= ", item.attributes.id);
        // console.log("ID VALUE= ", item.attributes.id.value);
        // console.log("classes= ", item.attributes.class.value);
        exportList.push(item.innerText + "\n_____\n\n\n");
    });
    let convertedList = exportList.toString();
    copyToClipboard(convertedList);
}

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert("All text copied to clipboard!");
};

function toggleSmallClass() {
    if (isSelected.classList.contains('smallBox')) {
        isSelected.classList.remove('smallBox')
    } else isSelected.classList.add('smallBox');
    fixLine();
};
function toggleColorClass() {
    if (isSelected.classList.contains('colorBox')) {
        isSelected.classList.remove('colorBox')
    } else isSelected.classList.add('colorBox');
};