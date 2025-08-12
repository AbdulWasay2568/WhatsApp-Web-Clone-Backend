"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reaction_controller_1 = require("../controllers/reaction.controller");
const reactionRoutes = (0, express_1.Router)();
reactionRoutes.get('/', reaction_controller_1.fetchReactionsController);
reactionRoutes.post('/', reaction_controller_1.createReactionController);
reactionRoutes.delete('/:id', reaction_controller_1.deleteReactionController);
exports.default = reactionRoutes;
