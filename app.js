// ENVIAR MENSAGEM
function sendMessage() {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if (!text) return;

    const user = localStorage.getItem("chatUser") || "??";

    db.collection("messages").add({
        chat: currentChat,
        text: text,
        user: user,
        time: Date.now()
    });

    input.value = "";
}

let currentChat = "global";


// CARREGAR MENSAGENS
function loadMessages(chatId) {
    currentChat = chatId;
    document.getElementById("messages").innerHTML = "";

    db.collection("messages")
        .where("chat", "==", chatId)
        .orderBy("time")
        .onSnapshot(snapshot => {

            const box = document.getElementById("messages");
            box.innerHTML = "";

            snapshot.forEach(doc => {
                const msg = doc.data();
                const div = document.createElement("div");

                div.className = "message" + 
                    (msg.user === localStorage.getItem("chatUser") ? " you" : "");

                div.innerText = msg.text;

                box.appendChild(div);
            });

            box.scrollTop = box.scrollHeight;
        });
}


// CRIAR GRUPO
function createGroup() {
    const name = prompt("Nome do grupo:");
    if (!name) return;

    db.collection("groups").add({ name });
}


// LISTAR GRUPOS
function loadGroups() {
    db.collection("groups").onSnapshot(snapshot => {

        const list = document.getElementById("groupList");
        list.innerHTML = "";

        // Chat principal
        const mainChat = document.createElement("div");
        mainChat.innerText = "Chat Principal";
        mainChat.onclick = () => {
            document.getElementById("chatTitle").innerText = "Chat Principal";
            loadMessages("global");
        };
        list.appendChild(mainChat);

        // Grupos adicionais
        snapshot.forEach(doc => {
            const g = doc.data();
            const div = document.createElement("div");

            div.innerText = g.name;
            div.onclick = () => {
                document.getElementById("chatTitle").innerText = g.name;
                loadMessages(doc.id);
            };

            list.appendChild(div);
        });
    });
}


// ⚡ INICIAR AO ABRIR O CHAT
window.onload = () => {
    loadGroups();
    loadMessages("global");
};
