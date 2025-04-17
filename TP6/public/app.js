document.addEventListener('DOMContentLoaded', () => {
    // Éléments DOM
    const messagesContainer = document.getElementById('messages-container');
    const noMessagesElement = document.getElementById('no-messages');
    const refreshButton = document.getElementById('refresh-button');
    const totalMessagesElement = document.getElementById('total-messages');
    const lastMessageTimeElement = document.getElementById('last-message-time');
    
    // Charger les messages au démarrage
    fetchMessages();
    
    // Actualiser les messages toutes les 5 secondes
    setInterval(fetchMessages, 5000);
    
    // Gestionnaire de clic pour le bouton de rafraîchissement
    refreshButton.addEventListener('click', () => {
        refreshButton.classList.add('rotate');
        fetchMessages();
        setTimeout(() => {
            refreshButton.classList.remove('rotate');
        }, 500);
    });
    
    // Fonction pour récupérer les messages de l'API
    async function fetchMessages() {
        try {
            const response = await fetch('/api/messages');
            if (!response.ok) {
                throw new Error('Échec de la récupération des messages');
            }
            
            const messages = await response.json();
            renderMessages(messages);
            updateStats(messages);
            
        } catch (error) {
            console.error('Erreur:', error);
            displayNotification('Erreur lors de la récupération des messages', 'danger');
        }
    }
    
    // Fonction pour afficher les messages dans l'interface
    function renderMessages(messages) {
        if (messages.length === 0) {
            noMessagesElement.style.display = 'block';
            messagesContainer.innerHTML = '';
            messagesContainer.appendChild(noMessagesElement);
            return;
        }
        
        noMessagesElement.style.display = 'none';
        messagesContainer.innerHTML = '';
        
        // Trier les messages du plus récent au plus ancien
        messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        messages.forEach((message, index) => {
            const messageElement = createMessageElement(message, index);
            messagesContainer.appendChild(messageElement);
        });
    }
    
    // Fonction pour créer un élément de message
    function createMessageElement(message, index) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-card animate-new';
        messageDiv.style.animationDelay = `${index * 0.1}s`;
        
        const timestamp = new Date(message.timestamp);
        const formattedTime = timestamp.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        messageDiv.innerHTML = `
            <div class="d-flex justify-content-between">
                <h6 class="mb-1">Message #${index + 1}</h6>
                <span class="badge bg-primary">${formattedTime}</span>
            </div>
            <p class="message-content mb-1">${escapeHtml(message.value)}</p>
            <div class="message-timestamp text-end">
                <small>ID: ${message._id ? message._id.substring(0, 8) + '...' : 'N/A'}</small>
            </div>
        `;
        
        return messageDiv;
    }
    
    // Fonction pour mettre à jour les statistiques
    function updateStats(messages) {
        totalMessagesElement.textContent = messages.length;
        
        if (messages.length > 0) {
            const lastMessage = new Date(messages[0].timestamp);
            lastMessageTimeElement.textContent = lastMessage.toLocaleTimeString('fr-FR');
        } else {
            lastMessageTimeElement.textContent = '-';
        }
    }
    
    // Fonction d'échappement HTML pour prévenir les injections
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Fonction pour afficher des notifications
    function displayNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification-toast shadow animate-new`;
        notification.innerHTML = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});