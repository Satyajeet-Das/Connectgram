import { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadWithUserId extends JwtPayload {
    userId: string; // Add other properties if needed
}

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload | JwtPayloadWithUserId; // Adjust type based on your payload structure
    }
  }
}


  