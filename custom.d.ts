/* eslint-disable prettier/prettier */
import { Request } from "express";

declare module "express" {
  interface Request {
    user?: User;
  }
}

type User = {
  userId: string;
  username: string;
  role: string;
};
