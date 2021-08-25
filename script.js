const secrets = document.querySelectorAll(".secret");
const titleEdit = document.querySelector('#titleEdit');
const textEdit = document.querySelector('#textEdit');
const boxes = document.querySelectorAll('.beatBox');
const mainBox = document.querySelector('.mainBox');
let cards = [];
let lines = [];
let loadList = {};
let lineKeepList = [];

//load saved shit, if shit not found spawn blank first card
initLoad();

function initLoad() {
    loadList = JSON.parse(localStorage.getItem('myStoryItems'));
    loadLinesList = JSON.parse(localStorage.getItem('myStoryLineItems'));
    console.log("LINES LIST: ", loadLinesList);
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
            console.log("this line is: ", item)
        });
    }
}

function loadBox(object) {
    let nuBox = document.createElement('div');
    // let nuNode = document.createElement('div');
    // let nuNode2 = document.createElement('div');
    // nuNode.classList.add('lineNode');
    // nuNode.classList.add('left');
    // nuNode2.classList.add('lineNode');
    // nuNode2.classList.add('right');
    nuBox.innerHTML = object.innerHTML;
    // nuBox.append(nuNode, nuNode2);
    let nuId = object.id;
    nuBox.id = nuId;
    nuBox.style = object.style;
    nuBox.classList.add('beatBox');
    makeDraggable(nuBox);
    mainBox.append(nuBox);
    draggable = new PlainDraggable(nuBox);
    draggable.autoScroll = true;
    draggable.onMove = function () {
        fixLine();
    }
    cards.push(nuBox);
}

boxes.forEach(box => {
    draggable = new PlainDraggable(box);
    draggable.autoScroll = true;
})

/* Set the width of the side navigation to 250px */
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

function saveChanges() {
    // console.log(isSelected.firstElementChild.textContent);
    isSelected.firstElementChild.textContent = titleEdit.value;
    isSelected.childNodes[1].innerText = textEdit.value;
}
let saveList = [];
let lineList = [];
function saveAll() {
    // let svgLines = Array.from(document.querySelectorAll('svg'));
    // svgLines.shift();
    saveList = [];
    lineList = [];
    cards.forEach(item => {
        // let position = draggable.position()
        // console.log(item);
        // console.log(item.innerHTML);
        // console.log(item.attributes);
        // console.log("ID= ", item.attributes.id);
        // console.log("ID VALUE= ", item.attributes.id.value);
        // console.log("classes= ", item.attributes.class.value);
        saveList.push(new storyBoxInfo(item.attributes.id.value, item.attributes.class.value, item.attributes.style.value, item.innerHTML));
    });
    // svgLines.forEach(line => {
    //     console.log("LINESTUFF: ", line);
    //     console.log("LINE style: ", line.style);
    //     lineList.push(new lineBoxInfo(line.innerHTML, line.style));
    // })
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
// class lineBoxInfo {
//     constructor(outerHTML, style) {
//         this.outerHTML = outerHTML;
//         this.style = style;
//         // this.start = start;
//         // this.end = end;
//     };
// }

//card constructor funtion- makes new card with unique ID
function spawnBox() {
    let nuBox = document.createElement('div');
    let nuNode = document.createElement('div');
    let nuNode2 = document.createElement('div');
    let nuTit = document.createElement('h2');
    let nuText = document.createElement('p');
    let nuId = cards.length + 1;
    nuNode.classList.add('lineNode');
    nuNode.classList.add('left');
    nuNode2.classList.add('lineNode');
    nuNode2.classList.add('right');
    nuBox.id = nuId;
    nuBox.classList.add('beatBox');
    nuBox.append(nuTit, nuText);
    nuBox.append(nuNode, nuNode2);
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
    console.log("storline start obj: ", start);
    console.log("storline end obj: ", end);
    lineKeepList.push([ID, start, end]);
};
function storeOldLine(start, end) {
    console.log("oldstorline start obj: ", start);
    console.log("oldstorline end obj: ", end);
    console.log("oldstorline ID: ", start.parentElement.id + "x" + end.parentElement.id);
    let ID = start.parentElement.id + "x" + end.parentElement.id;
    lineKeepList.push([ID, start, end]);
};
function removeLine(id) {
    for (let i = 0; i < lineKeepList.length; i++) {
        if (lineKeepList[i].id === id) {
            delete lineKeepList[i].id;
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
window.onkeydown = function (event) {
    if (event.keyCode === 32) {
        event.preventDefault();
    }
};
// document.addEventListener('click', function (e) {
//     if (e.currentTarget !== isSelected) {
//         cards.forEach(card => card.classList.remove('selected'))
//     }
// })

//sidenav if closed clikc open
