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
            divChatMessages.style.height = '0px';
            divChatMessages.style.overflow = 'hidden';
            divChatMessages.style.paddingButton = '0px';
        }, 10); // Small delay to ensure the height is set before transitioning
        
        isClosed = true;
    } else {
        divChatMessages.style.height = '300px';
        divChatMessages.style.overflow = 'auto';
        divChatMessages.style.paddingButton = '';


        setTimeout(function(){
            divChatMessages.style.height = '';
        }, 5000); // Delay to allow the transition to complete before resetting height to auto
        
        isClosed = false;
    }
});