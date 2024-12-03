import { model, Schema } from "mongoose";
import { Role } from "./enums";

export interface IUserModel extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    roleId: Role;
}

export const UserSchema = new Schema<IUserModel> (
    {
        firstName: {
            type: String,
            required: [true, "Missing first name"],
            minlength: [2, "first name too short"],
            maxlength: [20, "first name too long"],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, "Missing last name"],
            minlength: [2, "last name too short"],
            maxlength: [20, "last name too long"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Missing email"],
            minlength: [5, "email too short"],
            maxlength: [30, "email too long"],
            trim: true
        },
        password: {
            type: String,
            required: [true, "Missing password"],
            minlength: [2, "password too short"],
            maxlength: [200, "password too long"],
            trim: true
        },
        roleId: {
            type: Number
        },
    },
    {
        versionKey: false
    }
)

export const UserModel = model<IUserModel>("UserModel",UserSchema,"users")

