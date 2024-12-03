import { Document, model, Schema } from "mongoose";
import { LikesModel } from "./likes-model";

export interface IVacationModel extends Document {
    destination: string;
    description: string;
    startDate: Date;
    endDate: Date;
    price: number;
    image: string;
}

export const VacationSchema = new Schema<IVacationModel> (
    {
        destination: {
            type: String,
            required: [true, "Missing destination"],
            minlength: [2, "destination too short"],
            maxlength: [30, "destination too long"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Missing description"],
            minlength: [2, "description too short"],
            maxlength: [200, "description too long"],
            trim: true
        },
        startDate: {
            type: Date,
            required: [true, "Missing start date"],
        },
        endDate: {
            type: Date,
            required: [true, "Missing end date"],
        },
        price: {
            type: Number,
            required: [true, "Missing price"],
            min: [1, "price too low"],
            max: [99999, "price too high"],
        },
        image: {
            type: String,
            required: [true, "Missing image"],
        },
    },
    {
        versionKey: false,
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
        id: false
    }
)

VacationSchema.virtual("usersLikes", {
    ref: LikesModel,
    localField: "_id",
    foreignField: "vacationId",
    justOne: false,
    
})

export const VacationModel = model<IVacationModel>("VacationModel",VacationSchema,"vacations")