// ----------------------------------------
// ENVIAR MENSAGEM
// ----------------------------------------
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


// Chat atual
let currentChat = "global";


// ----------------------------------------
// CARREGAR MENSAGENS
// ----------------------------------------
function loadMessages(chatId) {
    currentChat = chatId;
    const box = document.getElementById("messages");
    box.innerHTML = "";

    db.collection("messages")
        .where("chat", "==", chatId)
        .orderBy("time")
        .onSnapshot(snapshot => {
            box.innerHTML = "";

            snapshot.forEach(doc => {
                const msg = doc.data();
                const div = document.createElement("div");

                div.className = "message" + 
                    (msg.user === localStorage.getItem("chatUser") ? " you" : "");

                div.textContent = msg.text;

                box.appendChild(div);
            });

            box.scrollTop = box.scrollHeight;
        });
}


// ----------------------------------------
// CRIAR GRUPO
// ----------------------------------------
function createGroup() {
    const name = prompt("Nome do grupo:");
    if (!name) return;

    db.collection("groups").add({
        name: name
    });
}


// ----------------------------------------
// CARREGAR LISTA DE GRUPOS
// ----------------------------------------
function loadGroups() {
    db.collection("groups")
        .onSnapshot(snapshot => {
            const list = document.getElementById("groupList");
            list.innerHTML = "";

            // Chat principal
            const main = document.createElement("div");
            main.textContent = "Chat Principal";
            main.onclick = () => {
                document.getElementById("chatTitle").textContent = "Chat Principal";
                loadMessages("global");
            };
            list.appendChild(main);

            // Outros grupos
            snapshot.forEach(doc => {
                const g = doc.data();
                const div = document.createElement("div");

                div.textContent = g.name;
                div.onclick = () => {
                    document.getElementById("chatTitle").textContent = g.name;
                    loadMessages(doc.id);
                };

                list.appendChild(div);
            });
        });
}


// ----------------------------------------
// INICIAR QUANDO ABRE O SITE
// ----------------------------------------
window.onload = () => {
    loadGroups();
    loadMessages("global");
};
