function add_message(txt,pseudo_,ext,color){
    let divChatMessages = document.querySelector('.div_chat_messages');
    let newMessage = document.createElement('div');
    newMessage.classList.add('message', ext);

    let txtMessage = document.createElement('div');
    txtMessage.classList.add('txt_message', ext);
    txtMessage.style.width = '0%';

    let pseudo = document.createElement('p');
    pseudo.id = 'pseudo';
    pseudo.textContent = pseudo_+":";
    pseudo.style.color = color;

    let text = document.createElement('p');
    text.id = 'text';
    text.textContent = txt;

    txtMessage.appendChild(pseudo);
    txtMessage.appendChild(text);
    newMessage.appendChild(txtMessage);
    divChatMessages.appendChild(newMessage);

    setTimeout(function(){
        txtMessage.style.width = '80%';
    }, 100);
    divChatMessages.scrollTop = divChatMessages.scrollHeight;
}

let bntSend = document.getElementById('send_message');

bntSend.addEventListener('click', function(){
    let txt = document.getElementById('text_area').value;
    document.getElementById('text_area').value = '';

    fetch('./php/send_chat.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ id_player: id_player, txt: txt})
    })
    .then(response => response.text())
    .then(data => {
    })
    .catch(error => console.error(error));

});


const divDeplacement = document.querySelector('.div_drag');
const divClose = document.querySelector('.div_close');
const divChat = document.querySelector('.div_chat');
const divChatMessages = document.querySelector('.div_chat_messages');
const divLogMessages = document.querySelector('.div_log_messages');
const divChatInput = document.querySelector('.div_chat_input');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let isClosed = false;
let height = 0;

// Quand on clique sur la div de déplacement
divDeplacement.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - divChat.offsetLeft;
    offsetY = e.clientY - divChat.offsetTop;
});

// Quand on bouge la souris
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        // Positionne la div en suivant la souris
        divChat.style.left = `${e.clientX - offsetX}px`;
        divChat.style.top = `${e.clientY - offsetY}px`;
    }
});

// Quand on relâche le clic de la souris
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Quand on clique sur le bouton de fermeture
divClose.addEventListener('click', () => {

    if (!isClosed) {
        height = divChatMessages.scrollHeight;
        divChatMessages.style.height = height + 'px';

        setTimeout(function(){
            divLogMessages.style.height = '0px';
            divLogMessages.style.overflow = 'hidden';
            divLogMessages.style.paddingButton = '0px';

            divChatMessages.style.height = '0px';
            divChatMessages.style.overflow = 'hidden';
            divChatMessages.style.paddingButton = '0px';
        }, 10);
        
        isClosed = true;
    } else {
        divLogMessages.style.height = '300px';
        divLogMessages.style.overflow = 'auto';
        divLogMessages.style.paddingButton = '';


        divChatMessages.style.height = '300px';
        divChatMessages.style.overflow = 'auto';
        divChatMessages.style.paddingButton = '';


        setTimeout(function(){
            divChatMessages.style.height = '';
        }, 5000); // Delay to allow the transition to complete before resetting height to auto
        
        isClosed = false;
    }
});


// changement de page

let bnts = document.querySelectorAll('.bnt_change');

bnts.forEach(bnt => {
    bnt.addEventListener('click', function(){  

        bnts.forEach(bnt => {
            bnt.classList.remove("btn_active");
        });

        bnt.classList.add("btn_active");
        if(bnt.id == "1"){
            document.getElementsByClassName('div_chat_messages')[0].style.display = 'flex';
            document.getElementsByClassName('div_log_messages')[0].style.display = 'none';
        }else if(bnt.id == "2"){
            document.getElementsByClassName('div_chat_messages')[0].style.display = 'none';
            document.getElementsByClassName('div_log_messages')[0].style.display = 'flex';
            
        }
    });
});

document.getElementsByClassName('bnt_change')[0].click();


function add_log(txt,color){
    let divLogMessages = document.querySelector('.div_log_messages');
    let div = document.createElement('div');
    div.classList.add('log');

    let txt_ = document.createElement("p");
    txt_.innerHTML = txt;

    div.appendChild(txt_);
    divLogMessages.appendChild(div);

    //select le <a> qu'il y a dans le texte h5
    let txtMessage = txt_.querySelector('a');
    if (txtMessage != null) {
        console.log(txtMessage);
        txtMessage.style.color = color;
    }
    setTimeout(function(){
        txtMessage.style.width = '80%';
    }, 100);
    divLogMessages.scrollTop = divLogMessages.scrollHeight;

}