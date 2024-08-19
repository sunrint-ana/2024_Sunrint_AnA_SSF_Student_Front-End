const endpoint = 'http://localhost:8080';

const body = document.getElementsByTagName('body')[0];
const grow = document.getElementById('grow');
const giftContainer = document.getElementById('giftContainer');

let pass;
let items;

// 새로운 중간트리 생성
function createNewTree() {
    const newLayer = document.createElement('img');
    newLayer.src = 'img/M.png';
    newLayer.className = 'M';
    
    grow.appendChild(newLayer);

    const scrollPos = window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop;

    console.log(scrollPos+newLayer.height);
    window.scrollTo(0, scrollPos+newLayer.height);
}

function addGift(type, clickEvent) {
    const gift = document.createElement('img');
    gift.src = "img/"+mapImage(type);
    gift.onclick = clickEvent;
    giftContainer.appendChild(gift);
    if(giftContainer.childElementCount > 3 && giftContainer.childElementCount%3==0) createNewTree();
}

function clearGift() {
    giftContainer.innerHTML = '';
    grow.innerHTML = '';
}

function mapImage(type) {
    switch (type) {
        case 0: return "ball_D.png";
        case 1: return "box_D.png";
        case 2: return "cake_D.png";
        case 3: return "gloves_D.png";
        case 4: return "star_D.png";
        default: return null;
    }
}

async function loadInformation() {
    return await ((await fetch(endpoint+'/info')).json());
}

async function loadItems() {
    return await (((await fetch(
        endpoint+'/items',
        {
            method: 'POST',
            body: JSON.stringify(
                {
                    "pass": document.querySelector('#pass').value
                }
            ),
            mode: 'cors'
        }
    )).json()));
}

async function postItem(author, message, type) {
    return await ((await fetch(
        endpoint+'/item',
        {
            method: 'POST',
            body: JSON.stringify(
                {
                    "author": author,
                    "message": message,
                    "type": type
                }
            )
        }
    )))
}

loadInformation().then(e => {
    document.querySelector('#name').innerText = e.name+"님의 트리";
});

function load() {
    loadItems().then(e => {
        items = e.items;
        items.forEach(element => {
            addGift(element.type, () => {
                console.log(element.author);
                if(!element.author) return;
                document.querySelector('#giftViewer').getElementsByTagName('textarea')[0].value = element.message ? element.message:"25일이 지나야지만 볼 수 있어요!";
                console.log();
                document.querySelector('#giftViewer').getElementsByTagName('p')[0].innerText = element.author+"이가 보냄";
                document.querySelector('#giftViewer').showModal();
            });
        });
    });
}

document.querySelector('#loginfin').onclick = () => {
    clearGift();
    load();
    document.querySelector('#loginfin').parentNode.close();
}

document.querySelector('#send').onclick = () => {
    postItem(document.querySelector('#sname').value, document.querySelector('#smessage').value, Math.floor(Math.random()*5)).then(e => window.location.reload());
    document.querySelector('#giftSender').close();
}

load();
// function test() {
//     for(let i =0; i<50; i++) {
//         addGift(Math.floor(Math.random()*5))
//     }
// }

// test()