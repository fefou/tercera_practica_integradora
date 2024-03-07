import mongoose from "mongoose";

const ticketEsquema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String
    },
  },
  { timestamps: true }
);

ticketEsquema.pre('save', async function (next) {
  if (!this.code) {
    let codeExists = true;
    let newCode;
    while (codeExists) {
      newCode = Math.random().toString(36).substring(2, 10);
      const existingTicket = await ticketModelo.findOne({ code: newCode });
      if (!existingTicket) {
        codeExists = false;
      }
    }
    this.code = newCode;
  }
  next();
});

export const ticketModelo = mongoose.model("ticket", ticketEsquema);
