document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================
    // 1. АНЫҚТАУ ЖӘНЕ ҚАУІПСІЗДІКТІ ТЕКСЕРУ
    // ===========================================
    const loggedInUser = localStorage.getItem('username');
    const loggedInRole = localStorage.getItem('userRole'); 

    // Егер қолданушы тіркелмесе, кіру бетіне жіберу
    if (!loggedInUser) {
        alert("Чатты қолдану үшін тіркеліңіз немесе кіріңіз!");
        // setTimeout арқылы бағыттау, alert-тен кейін жүру үшін
        setTimeout(() => {
            window.location.href = 'register.html';
        }, 50);
        return; 
    }

    const chatList = document.getElementById('chatList');
    const chatMessages = document.getElementById('chatMessages');
    const currentChatHeader = document.getElementById('currentChatHeader');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    
    let activeChatPartner = null;
    
    // Хабарламалардың жергілікті қоймасының имитациясы
    let chatsData = JSON.parse(localStorage.getItem('helpmap_chats')) || {}; 
    
    // Чат деректерін LocalStorage-ға сақтау функциясы
    function saveChatsData() {
        localStorage.setItem('helpmap_chats', JSON.stringify(chatsData));
    }


    // ===========================================
    // 2. ЧАТТАР ТІЗІМІН ҚҰРУ (Имитация)
    // ===========================================

    // Чат әріптестерінің имитацияланған тізімі
    const mockPartners = [
        { id: 1, name: "Айжан", role: "volunteer", label: "(Ерікті)" },
        { id: 2, name: "Қанат", role: "help", label: "(Мұқтаж)" },
        { id: 3, name: "Мейрам", role: "volunteer", label: "(Ерікті)" },
        { id: 4, name: "Сәуле", role: "help", label: "(Мұқтаж)" }
    ];

    function renderChatList() {
        chatList.innerHTML = ''; // Тазарту

        mockPartners.forEach(partner => {
            // Қолданушының рөлі әріптестің рөліне сәйкес келсе, оны өткізіп жіберу (яғни, ерікті еріктіні көрмейді)
            if (partner.role === loggedInRole) return; 

            const partnerFullName = `${partner.name} ${partner.label}`;
            // Чатты сақтау үшін бірегей идентификатор құру
            const chatId = `chat_${loggedInUser}_${partner.name}`; 
            
            // Егер бұл чат бұрын сақталмаған болса, оны инициализациялау
            if (!chatsData[chatId]) {
                 chatsData[chatId] = []; 
                 saveChatsData();
            }
            
            const item = document.createElement('div');
            item.classList.add('chat-list-item');
            item.setAttribute('data-chat-id', chatId);
            item.setAttribute('data-user-name', partnerFullName);
            
            // Әріптестің рөліне байланысты иконка таңдау
            const iconClass = partner.role === 'volunteer' ? 'fa-hands-helping' : 'fa-home';
            item.innerHTML = `
                <i class="fas ${iconClass} chat-icon"></i>
                <div class="chat-info">
                    <strong>${partnerFullName}</strong>
                </div>
            `;
            
            item.addEventListener('click', () => startChat(item, partnerFullName, chatId));
            chatList.appendChild(item);
        });

        // Ең бірінші чатты автоматты түрде ашу
        const firstChat = document.querySelector('.chat-list-item');
        if(firstChat) {
            startChat(firstChat, firstChat.getAttribute('data-user-name'), firstChat.getAttribute('data-chat-id'));
        } else {
             currentChatHeader.textContent = `Сөйлесуге әріптес табылмады.`;
        }
    }

    // ===========================================
    // 3. ЧАТТЫ БАСТАУ ЖӘНЕ ХАБАРЛАМАЛАРДЫ КӨРСЕТУ
    // ===========================================

    function startChat(selectedItem, partnerName, chatId) {
        // Active классты басқару
        document.querySelectorAll('.chat-list-item').forEach(item => item.classList.remove('active'));
        selectedItem.classList.add('active');

        // Айнымалыларды жаңарту
        activeChatPartner = { id: chatId, name: partnerName };
        currentChatHeader.textContent = `Сөйлесу: ${partnerName}`;
        
        // Хабарлама жіберуді іске қосу
        messageInput.disabled = false;
        sendMessageBtn.disabled = false;
        messageInput.focus();

        renderMessages(chatId);
    }

    function renderMessages(chatId) {
        chatMessages.innerHTML = '';
        const messages = chatsData[chatId] || [];

        if (messages.length === 0) {
            chatMessages.innerHTML = '<p style="text-align:center; color:#888; margin-top: 20px;">Әзірге хабарлама жоқ. Сөйлесуді бастаңыз!</p>';
        }

        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            
            // Хабарлама жіберушінің аты
            const senderName = msg.sender;

            const isSent = senderName === loggedInUser;
            messageElement.classList.add(isSent ? 'message-sent' : 'message-received');

            messageElement.innerHTML = `
                ${msg.text}
                <span class="message-time">${msg.time}</span>
            `;
            chatMessages.appendChild(messageElement);
        });
        
        // Әрдайым төменгі жағына жылжу
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ===========================================
    // 4. ХАБАРЛАМА ЖІБЕРУ ЛОГИКАСЫ (МАҢЫЗДЫ БӨЛІК)
    // ===========================================

    // Жіберу батырмасына басу
    sendMessageBtn.addEventListener('click', sendMessage);
    
    // Enter батырмасын басу
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            sendMessage();
        }
    });

    function sendMessage() {
        const text = messageInput.value.trim();
        // Егер хабарлама мәтіні бос болса немесе чат таңдалмаса, тоқтату
        if (!text || !activeChatPartner) return;

        const newMessage = {
            sender: loggedInUser, // Жіберушінің аты
            text: text,
            time: new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
        };

        // Хабарламаны жергілікті қоймаға сақтау
        chatsData[activeChatPartner.id].push(newMessage);
        saveChatsData(); 
        
        // Интерфейсті жаңарту
        renderMessages(activeChatPartner.id);

        // Input-ты тазарту
        messageInput.value = '';

        // **WEBSOCKET ИМИТАЦИЯСЫ: 2 секундтан кейін жауап қайтару**
        setTimeout(() => {
            simulateResponse(activeChatPartner.id, activeChatPartner.name);
        }, 2000); 
    }
    
    function simulateResponse(chatId, partnerFullName) {
        const partnerName = partnerFullName.split(' ')[0]; // Тек атты алу
        
        let responseText;
        if (loggedInRole === 'volunteer') {
             // Ерікті жауап алды
            responseText = `Рахмет, ${loggedInUser}. ${partnerName} сіздің көмегіңізді қабылдады. Жақсы! Мен жолдамын. (Имитация)`; 
        } else {
             // Мұқтаж адам жауап алды
            responseText = `Керемет, ${loggedInUser}! ${partnerName} көмекке дайын. Қажетті құралдарды дайындап қойыңыз. (Имитация)`; 
        }

        const responseMessage = {
            sender: partnerName, 
            text: responseText,
            time: new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' })
        };

        chatsData[chatId].push(responseMessage);
        saveChatsData(); 
        
        // Егер бұл чат ашық болса, интерфейсті жаңарту
        if (activeChatPartner && activeChatPartner.id === chatId) {
            renderMessages(chatId);
        }
    }

    // ===========================================
    // 5. ІСКЕ ҚОСУ
    // ===========================================
    renderChatList(); 
});