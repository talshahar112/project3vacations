import { IUserModel, UserModel} from "../3-models/user-model";
import { Role } from "../3-models/enums";
import { CredentialsModel } from "../3-models/credentials-model";
import { cyber } from "../2-utils/cyber";
import { ConflictError, UnauthorizedError } from "../3-models/client-errors";

// Deals with users:
class UserService {

    // Register new user: 
    public async register(user: IUserModel) {

        const existingUser = await UserModel.findOne({email:user.email}).exec()
        if (existingUser) {
            throw new ConflictError ("email already register")
        }
        user.password = cyber.hash(user.password)
        user.roleId = Role.User
        const saveUser = await new UserModel(user).save()
        const token = cyber.generateNewToken(saveUser)
        return token
    }


    public async login(credentials: CredentialsModel) {
        credentials.password = cyber.hash(credentials.password); // hash incoming password
        const user = await UserModel.findOne({
            email: credentials.email
        }).exec();
    
        if (!user || user.password !== credentials.password) {  // Compare hashed passwords
            console.log("user not found/incorrect password");
            throw new UnauthorizedError("Incorrect email or password");
        }
    
        const token = cyber.generateNewToken(user);
        return token;
    }
    

}

export const userService = new UserService();

