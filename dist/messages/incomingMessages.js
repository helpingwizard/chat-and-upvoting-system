"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportesMessage = void 0;
const zod_1 = __importDefault(require("zod"));
var SupportesMessage;
(function (SupportesMessage) {
    SupportesMessage["JoinRoom"] = "JOIN_ROOM";
    SupportesMessage["SendMessage"] = "SEND_MESSAGE";
    SupportesMessage["UpvoteMessage"] = "UPVOTE_MESSAGE";
})(SupportesMessage || (exports.SupportesMessage = SupportesMessage = {}));
const initMessage = zod_1.default.object({
    name: zod_1.default.string(),
    userId: zod_1.default.string(),
    roomId: zod_1.default.string()
});
const UserMessages = zod_1.default.object({
    userId: zod_1.default.string(),
    roomId: zod_1.default.string(),
    message: zod_1.default.string()
});
const upVoteMessage = zod_1.default.object({
    userId: zod_1.default.string(),
    roomId: zod_1.default.string(),
    chatId: zod_1.default.string()
});
