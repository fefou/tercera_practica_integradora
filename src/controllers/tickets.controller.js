import ticketsModelo from "../models/tickets.model.js";

export class ticketsController {
  constructor() {}

  static async getTickets(req, res) {
    try {
      const tickets = await ticketsModelo.find();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTicketById(req, res) {
    try {
      const ticket = await ticketsModelo.findById(req.params.tid);
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async postTicket(req, res) {
    try {
      const ticket = new ticketsModelo(req.body);
      await ticket.save();
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async putTicket(req, res) {
    try {
      const ticket = await ticketsModelo.findByIdAndUpdate(
        req.params.tid,
        req.body,
        { new: true }
      );
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteTicket(req, res) {
    try {
        const ticket = await ticketsModelo.findByIdAndDelete(req.params.tid);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  }
}
