# 🚀 Multichat Implementation Plan - React Frontend

---

## 📢 INSTRUCTIONS POUR GEMINI LLM

### 📂 **Fichier à utiliser**
**Nom du fichier:** `claude.md`
**Chemin complet:** `C:\Users\lungs\Documents\GitHub\real_time_chat\claude.md`

### 🎯 **Comment utiliser ce fichier**
1. **Lis ce fichier en entier** pour comprendre le contexte du projet
2. **Section "DOCUMENTATION DES CHANGEMENTS BACKEND"** (en bas) : Contient TOUS les changements backend déjà effectués
3. **Section "Milestones"** : Décrit les fonctionnalités à implémenter dans le frontend React
4. **Section "Socket.IO Events"** : Liste complète des événements WebSocket disponibles
5. **Section "API Endpoints"** : Liste des endpoints REST déjà disponibles

### ⚠️ **IMPORTANT**
- **Backend = READ-ONLY** : Ne modifie AUCUN fichier backend, tout est déjà fait
- **Branche Git actuelle:** `feature/milestone-multichat-premium` (contient tous les changements backend)
- **Seed data disponible:** 8 utilisateurs + 3 multichats de test (lance `npm run seed`)
- **Frontend à créer:** Utilise React 18+ avec Socket.IO Client

### 📋 **Ce que tu dois faire**
1. Créer l'application React frontend selon le plan ci-dessous
2. Utiliser les événements Socket.IO documentés dans ce fichier
3. Appeler les API REST documentées dans ce fichier
4. Tester avec les données de seed (8 utilisateurs, 3 multichats)

---

## 📋 Project Overview
Build a **React-based multichat system** that allows premium users to create group chats and add participants. The system will leverage the existing backend infrastructure (`/conversation/premium` namespace).

---

## 🎯 Milestones

### **Milestone 1: Create Multichat (Premium Users Only)**
**Objective:** Allow premium users to create new multichat rooms.

**Requirements:**
- ✅ Only premium users can create multichat rooms
- ✅ Room creator sets room name/description
- ✅ Auto-join creator to the room upon creation
- ✅ Store room in database (using existing Conversation model)

**API Endpoint:**
```
POST /premium/conversation
Body: { user_id: <creator_id> }
Response: { success: true, data: { conversation } }
```

**React Components:**
1. `CreateMultichatModal.jsx` - Modal for creating new room
2. `CreateMultichatButton.jsx` - Button to trigger modal (premium only)

**State Management:**
- Current user info (id, premium status)
- Room creation form (name, description)
- Loading/error states

---

### **Milestone 2: Add People to Multichat**
**Objective:** Allow room participants to invite other users to the multichat.

**Requirements:**
- ✅ Show list of available users to add
- ✅ Search/filter users by username
- ✅ Add user to ConversationUser table
- ✅ Notify added user in real-time
- ✅ Update participant list for all room members

**API Endpoints:**
```
GET /users - Get all users
POST /premium/rooms/:id/add-user
Body: { user_id: <user_to_add> }
```

**React Components:**
1. `AddUserModal.jsx` - Modal to select users
2. `UserSearchInput.jsx` - Search/filter users
3. `UserListItem.jsx` - Display user with "Add" button
4. `ParticipantsList.jsx` - Show current room participants

**Socket.IO Events:**
```javascript
// Emit when user is added
socket.emit('add_user_to_room', { conversationId, userId });

// Listen for user added
socket.on('user_added_to_room', ({ userId, username }) => {
  // Update participant list
});
```

---

## 📁 File Structure

```
real_time_chat_front/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── multichat/
│   │   │   ├── CreateMultichatModal.jsx       [NEW]
│   │   │   ├── CreateMultichatButton.jsx      [NEW]
│   │   │   ├── AddUserModal.jsx               [NEW]
│   │   │   ├── UserSearchInput.jsx            [NEW]
│   │   │   ├── UserListItem.jsx               [NEW]
│   │   │   ├── ParticipantsList.jsx           [NEW]
│   │   │   ├── RoomList.jsx                   [NEW]
│   │   │   ├── RoomListItem.jsx               [NEW]
│   │   │   ├── ChatArea.jsx                   [NEW]
│   │   │   ├── MessageList.jsx                [NEW]
│   │   │   ├── MessageInput.jsx               [NEW]
│   │   │   └── MessageItem.jsx                [NEW]
│   │   ├── auth/
│   │   │   ├── Login.jsx                      [EXISTING/ADAPT]
│   │   │   └── Register.jsx                   [EXISTING/ADAPT]
│   │   └── common/
│   │       ├── Button.jsx                     [NEW]
│   │       ├── Modal.jsx                      [NEW]
│   │       └── Input.jsx                      [NEW]
│   ├── hooks/
│   │   ├── useSocket.js                       [NEW]
│   │   ├── useAuth.js                         [NEW]
│   │   └── useMultichat.js                    [NEW]
│   ├── services/
│   │   ├── api.js                             [NEW]
│   │   ├── socket.js                          [NEW]
│   │   └── auth.js                            [NEW]
│   ├── context/
│   │   ├── AuthContext.jsx                    [NEW]
│   │   └── SocketContext.jsx                  [NEW]
│   ├── pages/
│   │   ├── MultichatPage.jsx                  [NEW]
│   │   └── LoginPage.jsx                      [NEW]
│   ├── utils/
│   │   ├── constants.js                       [NEW]
│   │   └── helpers.js                         [NEW]
│   ├── App.jsx                                [NEW]
│   └── index.js                               [NEW]
├── package.json
└── README.md
```

---

## 🔧 Technical Stack

**Frontend:**
- React 18+
- Socket.IO Client
- React Router (for navigation)
- Axios (HTTP requests)
- CSS Modules or Styled Components

**Backend (Existing - DO NOT MODIFY):**
- Node.js + Express
- Socket.IO Server
- MySQL + Sequelize
- JWT Authentication

---

## 🎨 Component Breakdown

### **1. CreateMultichatModal.jsx**
```jsx
// Features:
- Input field for room name
- Textarea for room description (optional)
- "Create" button (disabled if not premium)
- Cancel button
- Loading spinner during creation
- Error message display
```

### **2. AddUserModal.jsx**
```jsx
// Features:
- Search input to filter users
- List of users (exclude current participants)
- "Add" button for each user
- Loading state for adding
- Success/error notifications
```

### **3. ParticipantsList.jsx**
```jsx
// Features:
- Display all room participants
- Show online/offline status
- Show user avatar/initials
- "Remove" button (if you're room creator)
```

### **4. RoomList.jsx**
```jsx
// Features:
- Display all available multichat rooms
- Highlight active room
- Show unread message count
- "Create Room" button (premium only)
- Click to switch rooms
```

### **5. ChatArea.jsx**
```jsx
// Features:
- Display room name
- Message list (scrollable)
- Message input at bottom
- "Add User" button
- Participants panel (collapsible)
```

---

## 🔌 Socket.IO Events

### **Client → Server**
```javascript
// Join a room
socket.emit('join_conversation', conversationId);

// Send message
socket.emit('send_message', { conversationId, content });

// Add user to room (new)
socket.emit('add_user_to_room', { conversationId, userId });

// Leave room (new)
socket.emit('leave_room', { conversationId });
```

### **Server → Client**
```javascript
// Receive message
socket.on('receive_message', (message) => { /* ... */ });

// Conversation history
socket.on('conversation_history', (messages) => { /* ... */ });

// User list update
socket.on('user_list_update', (userIds) => { /* ... */ });

// User joined
socket.on('user_joined', ({ userId, username }) => { /* ... */ });

// User added to room (new)
socket.on('user_added_to_room', ({ userId, username }) => { /* ... */ });

// User status changed
socket.on('user_status_changed', ({ userId, online }) => { /* ... */ });
```

---

## 📐 State Management

### **AuthContext**
```javascript
{
  user: { id, username, email, premium },
  token: "JWT_TOKEN",
  login: (email, password) => Promise,
  logout: () => void,
  isAuthenticated: boolean
}
```

### **SocketContext**
```javascript
{
  socket: SocketIOClient,
  connected: boolean,
  connect: () => void,
  disconnect: () => void
}
```

### **MultichatContext (or local state)**
```javascript
{
  rooms: [{ id, name, participants, unreadCount }],
  activeRoom: { id, name, participants, messages },
  users: [{ id, username, online }],
  setActiveRoom: (roomId) => void,
  sendMessage: (content) => void,
  addUserToRoom: (userId) => Promise,
  createRoom: (name, description) => Promise
}
```

---

## 🚦 Implementation Steps

### **Phase 1: Project Setup**
1. Initialize React app (`create-react-app` or Vite)
2. Install dependencies:
   ```bash
   npm install socket.io-client axios react-router-dom
   ```
3. Set up folder structure
4. Configure API base URL and Socket.IO URL

### **Phase 2: Authentication**
1. Create `AuthContext` and `useAuth` hook
2. Build `LoginPage.jsx` component
3. Implement JWT token storage (localStorage)
4. Create protected route wrapper
5. Test login with existing users

### **Phase 3: Socket.IO Integration**
1. Create `SocketContext` and `useSocket` hook
2. Implement Socket.IO connection with JWT auth
3. Handle connection/disconnection events
4. Test connection to `/conversation/premium` namespace

### **Phase 4: Milestone 1 - Create Multichat**
1. Build `CreateMultichatButton.jsx`
2. Build `CreateMultichatModal.jsx`
3. Implement API call to `POST /premium/conversation`
4. Add premium-only validation
5. Test room creation and auto-join

### **Phase 5: Milestone 2 - Add Users**
1. Build `AddUserModal.jsx`
2. Build `UserSearchInput.jsx` and `UserListItem.jsx`
3. Implement user search/filter logic
4. Create API endpoint for adding users (backend adaptation)
5. Emit `add_user_to_room` socket event
6. Update participant list in real-time
7. Test with multiple users

### **Phase 6: Chat Interface**
1. Build `RoomList.jsx` and `RoomListItem.jsx`
2. Build `ChatArea.jsx`, `MessageList.jsx`, `MessageInput.jsx`
3. Build `ParticipantsList.jsx`
4. Implement room switching
5. Load and display message history
6. Send/receive messages in real-time

### **Phase 7: Polish & Testing**
1. Add CSS styling (responsive design)
2. Add loading states and error handling
3. Add notifications (user joined, message received)
4. Test with multiple users and rooms
5. Fix bugs and edge cases

---

## 🎯 Success Criteria

### **Milestone 1:**
- ✅ Premium user can create multichat room
- ✅ Room is saved in database
- ✅ Creator auto-joins the room
- ✅ Room appears in room list

### **Milestone 2:**
- ✅ User can search for other users
- ✅ User can add someone to the room
- ✅ Added user receives notification
- ✅ Participant list updates for all users
- ✅ Added user can see room in their room list

---

## 🧪 Testing Plan

### **Manual Testing:**
1. Login as premium user → Create room → Success
2. Login as non-premium user → Create room button hidden
3. Add user to room → User receives notification
4. Send message in room → All participants see it
5. Leave room → Room disappears from list
6. Multiple users in same room → Messages sync

### **Automated Testing (Optional):**
- Unit tests for components (Jest + React Testing Library)
- Integration tests for socket events
- E2E tests (Cypress/Playwright)

---

## ⚠️ Important Rules (from .gemini/style.md)

### **Architecture:**
- Follow clean, modular architecture
- Separate concerns: Components → Hooks → Services → API
- No business logic in components (use hooks/context)

### **Code Style:**
- Use ES Modules (`import/export`)
- Use `async/await` (no `.then()` chains)
- Naming: `kebab-case` for files, `PascalCase` for components, `camelCase` for functions
- 2-space indentation
- Add clear comments for complex logic

### **Security:**
- Never store sensitive data in localStorage (only JWT token)
- Validate user premium status before showing create button
- Handle JWT expiration gracefully
- Sanitize user inputs

### **API:**
- Use prepared requests (Axios interceptors for auth)
- Standardized responses:
  ```json
  { "success": true, "data": {...} }
  { "success": false, "error": "Error message" }
  ```

### **Socket.IO:**
- Authenticate socket connection with JWT
- Handle disconnection gracefully
- No SQL in socket handlers (backend rule)
- Emit events with clear names

---

## 📊 Database Schema (Reference)

**Conversations** (multichat rooms):
```sql
id, user1_id, user2_id, created_at
-- For multichat: user1_id = user2_id (creator)
```

**ConversationUser** (room participants):
```sql
id, conversation_id, user_id, created_at
-- Many-to-many relationship
```

**Messages**:
```sql
id, conversation_id, sender_id, content, created_at
```

**Users**:
```sql
id, username, email, password_hash, premium, created_at
```

---

## 🔗 API Endpoints (Existing)

```
POST /auth/login
POST /auth/register
GET  /users (requires auth)
POST /premium/conversation (requires auth)
GET  /premium (requires auth)
```

**Socket.IO Namespace:**
```
http://localhost:3000/conversation/premium
Path: /socket.io-premium/
Auth: { token: "JWT_TOKEN" }
```

---

## 📝 Notes

- Backend code is **READ-ONLY** - do not modify
- Use existing socket namespace and events when possible
- Follow .gemini/style.md and .gemini/projet/projet.md guidelines
- Premium validation must happen on frontend AND backend
- Test with seeded data (8 users, 3 multichat rooms)

---

## 🚀 Next Steps

1. Review this plan
2. Set up React project structure
3. Start with Phase 1 (Project Setup)
4. Implement Milestone 1 (Create Multichat)
5. Implement Milestone 2 (Add Users)
6. Polish and test

---

**Estimated Timeline:**
- Phase 1-2: 2-3 hours
- Phase 3: 1-2 hours
- Phase 4 (Milestone 1): 2-3 hours
- Phase 5 (Milestone 2): 2-3 hours
- Phase 6: 3-4 hours
- Phase 7: 2-3 hours

**Total: ~12-18 hours**

---

---

# 📝 DOCUMENTATION DES CHANGEMENTS BACKEND (EN FRANÇAIS)

## 🌿 Branche Git
**Nom de la branche:** `feature/milestone-multichat-premium`

## 📂 Emplacement du fichier
**Chemin complet:** `C:\Users\lungs\Documents\GitHub\real_time_chat\claude.md`

---

## 📋 RÉSUMÉ DES MODIFICATIONS

Ce milestone ajoute les fonctionnalités suivantes au backend :
1. ✅ Création de conversations multichat (groupes premium)
2. ✅ Ajout/Suppression d'utilisateurs dans les groupes
3. ✅ Gestion du statut en ligne des utilisateurs
4. ✅ Suppression de conversations
5. ✅ Support des noms de groupe (champ `name` dans la table Conversations)
6. ✅ Données de test (3 multichats avec 8 utilisateurs)

---

## 🗂️ FICHIERS MODIFIÉS

### 1. **scripts/seed.js**
📍 **Emplacement:** `real_time_chat/scripts/seed.js`

**Changements:**
- ✅ Ajout de 3 nouveaux utilisateurs premium (Charlie, David, Emma)
- ✅ Création de 3 conversations multichat :
  - **Multichat 1:** Tech Discussion (IDs: Alice, Gin, Charlie, David)
  - **Multichat 2:** Gaming Group (IDs: Alice, Bob, Gin, Emma)
  - **Multichat 3:** General Chat (IDs: Charlie, David, Emma)
- ✅ Ajout de messages de test dans chaque multichat
- ✅ Remplissage de la table `ConversationUser` avec les participants

**Action requise:**
```bash
# Réinitialiser la base de données avec les nouvelles données
npm run seed
```

---

### 2. **src/models/conversation.model.js**
📍 **Emplacement:** `real_time_chat/src/models/conversation.model.js`

**Changements:**
- ✅ Ajout du champ `name` (VARCHAR 255) pour les noms de groupe
- ✅ `name` est nullable (NULL pour les conversations 1-à-1)

**Exemple:**
```javascript
{
  id: 5,
  user1_id: null,  // NULL pour les multichats
  user2_id: null,  // NULL pour les multichats
  name: 'Tech Discussion',
  created_at: '2025-10-05'
}
```

**Action requise:**
```bash
# Si tu utilises des migrations Sequelize
npx sequelize-cli migration:generate --name add-name-to-conversations
# Puis ajoute le champ "name" dans la migration
npx sequelize-cli db:migrate
```

---

### 3. **src/controllers/conversationPremium.controller.js**
📍 **Emplacement:** `real_time_chat/src/controllers/conversationPremium.controller.js`

**Changements:**
- ✅ Modification de `createPremiumConversationPremium()` pour accepter `name` dans le body
- ✅ Ajout de la méthode `deleteConversation()` pour supprimer un groupe

**Nouvelle API:**
```javascript
// Créer un multichat avec un nom
POST /premium/conversation
Body: { user_id: 1, name: "Mon Groupe" }

// Supprimer un multichat
DELETE /premium/conversation/:id
```

---

### 4. **src/routes/conversationPremium.routes.js**
📍 **Emplacement:** `real_time_chat/src/routes/conversationPremium.routes.js`

**Changements:**
- ✅ Ajout de la route `DELETE /premium/conversation/:id`

**Nouvelle route:**
```javascript
router.delete('/conversation/:id', authMiddleware, premiumController.deleteConversation);
```

---

### 5. **src/services/conversation.service.js**
📍 **Emplacement:** `real_time_chat/src/services/conversation.service.js`

**Changements:**
- ✅ Modification de `createPremiumConversation(user_id, name)`:
  - Crée une conversation avec `user1_id = null` et `user2_id = null` (pour les groupes)
  - Ajoute le créateur dans la table `ConversationUser`
  - Stocke le nom du groupe
- ✅ Ajout de `deleteConversation(conversationId)`:
  - Supprime tous les messages
  - Supprime tous les participants (ConversationUser)
  - Supprime la conversation

**Exemple d'utilisation:**
```javascript
// Créer un multichat
const conversation = await conversationService.createPremiumConversation(1, 'Mon Groupe');

// Supprimer un multichat
await conversationService.deleteConversation(5);
```

---

### 6. **src/sockets/premiumSockerManager.js**
📍 **Emplacement:** `real_time_chat/src/sockets/premiumSockerManager.js`

**Changements:**
- ✅ Correction d'un bug : `conversationId` n'était pas défini au bon endroit
- ✅ Ajout de l'événement `online_users_list` envoyé à la connexion
- ✅ Modification de `user_list_update` pour envoyer **TOUS les participants** (pas seulement les connectés)
- ✅ Ajout de `room_users_online_status` pour indiquer qui est en ligne
- ✅ Ajout de 3 nouveaux événements Socket.IO :
  - `add_user_to_room` - Ajouter un utilisateur au groupe
  - `remove_user_from_room` - Retirer un utilisateur du groupe
  - `delete_conversation` - Supprimer un groupe

**Nouveaux événements Socket.IO:**

```javascript
// CLIENT → SERVEUR
socket.emit('add_user_to_room', { conversationId: 5, userId: 3 });
socket.emit('remove_user_from_room', { conversationId: 5, userId: 3 });
socket.emit('delete_conversation', { conversationId: 5 });

// SERVEUR → CLIENT
socket.on('user_added', ({ userId, username }) => { /* ... */ });
socket.on('user_removed', ({ userId, username }) => { /* ... */ });
socket.on('conversation_deleted', ({ conversationId }) => { /* ... */ });
socket.on('online_users_list', (userIds) => { /* ... */ });
socket.on('room_users_online_status', { 1: true, 2: false, 3: true });
socket.on('room_list_update', () => { /* Rafraîchir la liste des rooms */ });
```

---

## 🔧 INSTRUCTIONS POUR GEMINI

### **Étape 1: Changer de branche**
```bash
git checkout feature/milestone-multichat-premium
```

### **Étape 2: Vérifier les fichiers modifiés**
```bash
git status
git diff master
```

### **Étape 3: Réinitialiser la base de données**
```bash
npm run seed
```

### **Étape 4: Tester les nouvelles fonctionnalités**

#### Test 1: Créer un multichat
```bash
# Fichier: http/milestone5.http
POST http://localhost:3000/premium/conversation
Authorization: Bearer <ton_token>
Content-Type: application/json

{
  "user_id": 1,
  "name": "Test Group"
}
```

#### Test 2: Ajouter un utilisateur via Socket.IO
```javascript
socket.emit('add_user_to_room', { conversationId: 5, userId: 3 });
```

#### Test 3: Supprimer une conversation
```bash
DELETE http://localhost:3000/premium/conversation/5
Authorization: Bearer <ton_token>
```

---

## 📊 NOUVELLES DONNÉES DE TEST

Après `npm run seed`, tu auras :

### Utilisateurs (8 au total)
| ID | Username | Email | Premium |
|----|----------|-------|---------|
| 1 | Alice | alice@example.com | true |
| 2 | Bob | bob@example.com | true |
| 3 | Gin | gin@example.com | true |
| 4 | Tonic | tonic@example.com | false |
| 5 | Aude | aude@example.com | false |
| 6 | Charlie | charlie@example.com | true |
| 7 | David | david@example.com | true |
| 8 | Emma | emma@example.com | true |

### Conversations Multichat (3 groupes)
| ID | Name | Participants |
|----|------|--------------|
| 3 | (Inféré: Tech Discussion) | Alice, Gin, Charlie, David |
| 4 | (Inféré: Gaming Group) | Alice, Bob, Gin, Emma |
| 5 | (Inféré: General Chat) | Charlie, David, Emma |

---

## ⚠️ NOTES IMPORTANTES

### **Différences clés par rapport à l'ancien système:**

1. **Conversations 1-à-1:**
   - `user1_id` et `user2_id` sont remplis
   - `name` = NULL

2. **Conversations Multichat:**
   - `user1_id` = NULL
   - `user2_id` = NULL
   - `name` = "Nom du groupe"
   - Les participants sont dans la table `ConversationUser`

### **Migration de base de données nécessaire:**
Si tu utilises Sequelize migrations, tu dois ajouter le champ `name`:

```javascript
// migration: XXXX-add-name-to-conversations.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Conversations', 'name', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Group chat name (null for 1-on-1 conversations)'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Conversations', 'name');
  }
};
```

---

## 🧪 COMMENT TESTER

### Avec REST Client (VSCode extension)
```bash
# 1. Ouvre le fichier http/milestone5.http
# 2. Clique sur "Send Request" au-dessus de chaque requête
# 3. Vérifie les réponses
```

### Avec un client Socket.IO (front/new_conversation.html)
```javascript
// 1. Ouvre front/new_conversation.html dans le navigateur
// 2. Connecte-toi avec un token JWT
// 3. Ouvre la console et teste:
socket.emit('join_conversation', 3);
socket.emit('add_user_to_room', { conversationId: 3, userId: 5 });
```

---

## 🔄 COMMENT REVENIR EN ARRIÈRE

Si le backend ne fonctionne pas, tu peux revenir à la version précédente:

```bash
# Option 1: Revenir à master (annule tous les changements)
git checkout master
git restore .

# Option 2: Voir les différences avant de décider
git diff master

# Option 3: Créer une nouvelle branche de backup
git checkout -b backup-before-testing
git checkout master
```

---

## 📞 CONTACT

Si tu as des questions sur ces changements, contacte-moi ou vérifie les fichiers suivants:
- `claude.md` (ce fichier)
- `http/milestone5.http` (exemples de requêtes)
- `API_DOCUMENTATION.md` (documentation API)

**Bon courage! 🚀**
