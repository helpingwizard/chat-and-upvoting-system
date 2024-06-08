"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
class UserManager {
    constructor() {
        this.rooms = new Map();
    }
    addUser(name, userId, roomId, socket) {
        var _a;
        if (!this.rooms.get(roomId)) {
            this.rooms.set(roomId, {
                users: []
            });
        }
        (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.push({
            name,
            id: userId,
            conn: socket
        });
    }
    getUser(roomId, userId) {
        var _a;
        const user = (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users.find(({ id }) => id === userId);
        return user !== null && user !== void 0 ? user : null;
    }
    removeUser(roomId, userId) {
        var _a;
        const users = (_a = this.rooms.get(roomId)) === null || _a === void 0 ? void 0 : _a.users;
        if (users) {
            this.rooms.set(roomId, {
                users: users.filter(({ id }) => id !== userId)
            });
        }
    }
    broadcast(roomId, userId, message) {
        const room = this.rooms.get(roomId);
        if (!room) {
            console.error("Room not found");
            return;
        }
        room.users.forEach(({ conn }) => {
            conn.sendUTF(JSON.stringify(message));
        });
    }
}
exports.UserManager = UserManager;
