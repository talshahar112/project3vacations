import express, { NextFunction, Request, Response } from "express";

// Data controller:
class DataController {

    // Create a router object for listening to HTTP requests:
    public readonly router = express.Router();

    // Register routes once: 
    public constructor() {
        this.registerRoutes();
    }

    // Register routes:
    private registerRoutes(): void {
        this.router.get("/", this.getAll___);
    }

    // GET http://localhost:4000/api/___
    private async getAll___(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            // ...
        }
        catch (err: any) { next(err); }
    }
}

const dataController = new DataController();
export const dataRouter = dataController.router;
