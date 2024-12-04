import mongoose from "mongoose"; // npm i mongoose
import { appConfig } from "./app-config";
class DAL {
    public async connect() {
        try {
            const db = await mongoose.connect(appConfig.mongodbConnectionString);
            console.log(`We're connected to MongoDB, database: ${db.connections[0].name}`);
        }
        catch (err: any) {
            console.log(err);
        }
    }
}
export const dal = new DAL();