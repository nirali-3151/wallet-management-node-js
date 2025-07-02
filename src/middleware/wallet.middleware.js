import Joi from "joi";

export const createWalletSchema = Joi.object({
  balance: Joi.number().required(), 
  receiver: Joi.string().required()
});

