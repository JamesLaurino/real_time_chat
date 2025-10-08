const socketIO = require('socket.io');
const { authenticateSocket } = require('../middleware/socket.middleware');
const ConversationUserService = require('../services/conversationUser.service.js');
const MessageService = require('../services/message.service');
const User = require('../models/user.model');
const ConversationUser = require('../models/conversation_user.model');

const onlineUsers = new Map();

function initPremiumSocket(server) {
    const io = socketIO(server, {
        path: '/socket.io-premium/',
        cors: {
            origin: '*',
        },
    });

    const premiumNamespace = io.of('/conversation/premium');

    premiumNamespace.use(authenticateSocket);

    premiumNamespace.on('connection', (socket) => {
        const { id: userId } = socket.decoded;
        console.log(`User connected: ${userId} with socket ${socket.id}`);
        onlineUsers.set(userId, true);

        // Send list of currently online users to the newly connected user
        const currentlyOnline = Array.from(onlineUsers.keys());
        socket.emit('online_users_list', currentlyOnline);
        console.log(`Sent online users list to ${userId}:`, currentlyOnline);

        // Notify others that this user is now online
        socket.broadcast.emit('user_status_changed', { userId, online: true });

        // ISSUE: console.log("Conversation ID : " + conversationId);
        // This line was causing a ReferenceError because conversationId is not defined here.
        // conversationId is only available inside the 'join_conversation' event handler below.

        socket.on('join_conversation', async (conversationId) => {
            socket.join('premium conversation room : ' + conversationId);
            console.log(`User ${userId} joined premium conversation room ` + conversationId);

            // Try to add user to conversation participants (will be ignored if already exists)
            try {
                await ConversationUserService.create({ conversation_id: conversationId, user_id: userId });
            } catch (e) {
                // Silently ignore if user is already in the conversation
                if (e.name !== 'SequelizeUniqueConstraintError') {
                    console.error('Failed to add user to premium group', e);
                }
            }

            // Fetch ALL participants from the database (not just connected users)
            const allParticipants = await ConversationUser.findAll({
                where: { conversation_id: conversationId },
                include: [{ model: User, attributes: ['id', 'username', 'email'] }]
            });

            // Format the participant data
            const usersData = allParticipants.map(participant => ({
                id: participant.User.id,
                user_id: participant.User.id,
                username: participant.User.username,
                email: participant.User.email,
                User: {
                    id: participant.User.id,
                    username: participant.User.username,
                    email: participant.User.email
                }
            }));

            premiumNamespace.to('premium conversation room : ' + conversationId).emit('user_list_update', usersData);

            // Send online status for ALL users in the room (from database)
            const onlineStatusMap = {};
            usersData.forEach(user => {
                const uid = user.id || user.user_id;
                onlineStatusMap[uid] = onlineUsers.has(uid);
            });
            socket.emit('room_users_online_status', onlineStatusMap);

            const user = await User.findByPk(userId);
            const username = user ? user.username : `User ${userId}`;
            premiumNamespace.to('premium conversation room : ' + conversationId).emit('user_joined', { userId, username });

            const history = await MessageService.getMessagesByConversationId(conversationId);
            socket.emit('conversation_history', history);
        });


        // Add user to room - { conversationId, userId }
        socket.on('add_user_to_room', async (data) => {
            try {
                const { conversationId, userId: targetUserId } = data;
                console.log(`User ${userId} adding user ${targetUserId} to conversation ${conversationId}`);

                // Create ConversationUser record
                await ConversationUserService.create({
                    conversation_id: conversationId,
                    user_id: targetUserId
                });

                // Fetch ALL participants from the database (not just connected users)
                const allParticipants = await ConversationUser.findAll({
                    where: { conversation_id: conversationId },
                    include: [{ model: User, attributes: ['id', 'username', 'email'] }]
                });

                // Format the participant data
                const usersData = allParticipants.map(participant => ({
                    id: participant.User.id,
                    user_id: participant.User.id,
                    username: participant.User.username,
                    email: participant.User.email,
                    User: {
                        id: participant.User.id,
                        username: participant.User.username,
                        email: participant.User.email
                    }
                }));

                // Notify everyone in the room about the updated user list
                premiumNamespace.to('premium conversation room : ' + conversationId).emit('user_list_update', usersData);

                // Send online status for ALL users in the room
                const onlineStatusMap = {};
                usersData.forEach(user => {
                    const uid = user.id || user.user_id;
                    onlineStatusMap[uid] = onlineUsers.has(uid);
                });
                premiumNamespace.to('premium conversation room : ' + conversationId).emit('room_users_online_status', onlineStatusMap);

                // Get user info and notify room
                const addedUser = await User.findByPk(targetUserId);
                const addedUsername = addedUser ? addedUser.username : `User ${targetUserId}`;
                premiumNamespace.to('premium conversation room : ' + conversationId).emit('user_added', {
                    userId: targetUserId,
                    username: addedUsername
                });

                // Notify ALL users to update their room lists (participant counts may have changed)
                premiumNamespace.emit('room_list_update');

                // Notify the user who performed the action
                socket.emit('user_add_success', { conversationId, userId: targetUserId });

            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    socket.emit('user_add_error', 'User is already in this room.');
                } else {
                    console.error('Error adding user to room:', error);
                    socket.emit('user_add_error', 'Failed to add user to room.');
                }
            }
        });

        // Remove user from room - { conversationId, userId }
        socket.on('remove_user_from_room', async (data) => {
            try {
                const { conversationId, userId: targetUserId } = data;
                console.log(`User ${userId} removing user ${targetUserId} from conversation ${conversationId}`);

                // Delete ConversationUser record
                await ConversationUser.destroy({
                    where: {
                        conversation_id: conversationId,
                        user_id: targetUserId
                    }
                });

                // Fetch ALL participants after removal
                const allParticipants = await ConversationUser.findAll({
                    where: { conversation_id: conversationId },
                    include: [{ model: User, attributes: ['id', 'username', 'email'] }]
                });

                // Format the participant data
                const usersData = allParticipants.map(participant => ({
                    id: participant.User.id,
                    user_id: participant.User.id,
                    username: participant.User.username,
                    email: participant.User.email,
                    User: {
                        id: participant.User.id,
                        username: participant.User.username,
                        email: participant.User.email
                    }
                }));

                // Notify everyone in the room about the updated user list
                premiumNamespace.to('premium conversation room : ' + conversationId).emit('user_list_update', usersData);

                // Send online status for ALL users in the room
                const onlineStatusMap = {};
                usersData.forEach(user => {
                    const uid = user.id || user.user_id;
                    onlineStatusMap[uid] = onlineUsers.has(uid);
                });
                premiumNamespace.to('premium conversation room : ' + conversationId).emit('room_users_online_status', onlineStatusMap);

                // Get user info and notify room
                const removedUser = await User.findByPk(targetUserId);
                const removedUsername = removedUser ? removedUser.username : `User ${targetUserId}`;
                premiumNamespace.to('premium conversation room : ' + conversationId).emit('user_removed', {
                    userId: targetUserId,
                    username: removedUsername
                });

                // Notify ALL users to update their room lists (participant counts may have changed)
                premiumNamespace.emit('room_list_update');

                // Notify the user who performed the action
                socket.emit('user_remove_success', { conversationId, userId: targetUserId });

            } catch (error) {
                console.error('Error removing user from room:', error);
                socket.emit('user_remove_error', 'Failed to remove user from room.');
            }
        });

        // MESSAGE_DATA  : { conversationId, content }
        socket.on('send_message', async (messageData) => {
            try {
                const conversationId = messageData.conversationId;

                console.log("Message Data : " + messageData);
                const newMessage = await MessageService.sendMessage(userId, null, messageData.content, conversationId);
                socket.nsp.to('premium conversation room : ' + conversationId).emit('receive_message', newMessage);
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('message_error', 'Failed to send message.');
            }
        });

        // Delete conversation - { conversationId }
        socket.on('delete_conversation', async (data) => {
            try {
                const { conversationId } = data;
                console.log(`User ${userId} deleting conversation ${conversationId}`);

                // Notify everyone in the room before deleting
                premiumNamespace.to('premium conversation room : ' + conversationId).emit('conversation_deleted', { conversationId });

                // Also broadcast to all connected users to refresh their room lists
                premiumNamespace.emit('room_list_update');

                socket.emit('delete_conversation_success', { conversationId });
            } catch (error) {
                console.error('Error deleting conversation:', error);
                socket.emit('delete_conversation_error', 'Failed to delete conversation.');
            }
        });

        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${userId}`);
            onlineUsers.delete(userId);
            premiumNamespace.emit('user_status_changed', { userId, online: false });

            // Update participant lists for all conversations this user was in
            for (const room of socket.rooms) {
                if (room !== socket.id && room.startsWith('premium conversation room : ')) {
                    // Extract conversation ID from room name
                    const conversationId = room.replace('premium conversation room : ', '');

                    // Fetch ALL participants from the database
                    const allParticipants = await ConversationUser.findAll({
                        where: { conversation_id: conversationId },
                        include: [{ model: User, attributes: ['id', 'username', 'email'] }]
                    });

                    // Format the participant data
                    const usersData = allParticipants.map(participant => ({
                        id: participant.User.id,
                        user_id: participant.User.id,
                        username: participant.User.username,
                        email: participant.User.email,
                        User: {
                            id: participant.User.id,
                            username: participant.User.username,
                            email: participant.User.email
                        }
                    }));

                    premiumNamespace.to(room).emit('user_list_update', usersData);

                    // Send updated online status for all users in the room
                    const onlineStatusMap = {};
                    usersData.forEach(user => {
                        const uid = user.id || user.user_id;
                        onlineStatusMap[uid] = onlineUsers.has(uid);
                    });
                    premiumNamespace.to(room).emit('room_users_online_status', onlineStatusMap);
                }
            }
        });
    });

    return io;
}

function isUserOnline(userId) {
    return onlineUsers.has(userId);
}

module.exports = {
    initPremiumSocket,
    isUserOnline,
    onlineUsers,
};