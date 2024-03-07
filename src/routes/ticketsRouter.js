import { Router } from "express";
import { ticketsController} from "../controllers/tickets.controller.js";

export const routerT = Router();

routerT.get("/", ticketsController.getTickets);
routerT.get("/:tid", ticketsController.getTicketById);
routerT.post("/", ticketsController.postTicket);
routerT.put("/:tid", ticketsController.putTicket);
routerT.delete("/:tid", ticketsController.deleteTicket);

