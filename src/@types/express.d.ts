import { Role } from '../types'; // Import your Role enum/type

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: Role;
        // add other properties if you use them, like email: string;
      };
    }
  }
}