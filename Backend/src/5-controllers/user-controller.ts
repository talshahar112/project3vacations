import express, { Request, Response, NextFunction } from "express";
import { UserModel } from "../3-models/user-model";
import { StatusCode } from "../3-models/enums";
import { userService } from "../4-services/user-service";
import { CredentialsModel } from "../3-models/credentials-model";
import { ConflictError, UnauthorizedError } from "../3-models/client-errors";

class UserController {

    public readonly router = express.Router();

    public constructor() {
        this.router.post("/register", this.register);
        this.router.post("/login", this.login);
        this.router.post("/check-email", this.checkEmail);
    }

    private async register(request: Request, response: Response, next: NextFunction) {
        try {
            const user = new UserModel(request.body);
            const token = await userService.register(user);
            response.status(StatusCode.Created).json(token);
        }
        catch (err: any) {
            if (err instanceof ConflictError) {
                response.status(StatusCode.Conflict).send(err.message)
            } else {
                next(err);
            }
        }
    }

    private async login(request: Request, response: Response, next: NextFunction) {
        try {
          const credentials = new CredentialsModel(request.body);
          const token = await userService.login(credentials);
          response.json(token);  // Send the token if login is successful.
        } catch (err: any) {
            console.log("Login failed:", err.message);  // Log the error message from backend
            if (err instanceof UnauthorizedError) {
                response.status(401).send(err.message);  // Send custom error message
            } else {
                next(err);  // Handle other types of errors
            }
        }
      }
      

    private async checkEmail(request: Request, response: Response, next: NextFunction) {
        try {
            const {email} = request.body
            const user = await UserModel.findOne({email}).exec()
            if (user) {
                response.status(200).json(true) //email already registered
            } else {
                response.status(200).json(false) //email is available
            }
        } catch (err: any) {
            next (err);
        }
    }

}

export const userController = new UserController();
export const userRouter = userController.router;