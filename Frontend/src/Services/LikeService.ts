import axios from "axios"
import { LikeModel } from "../Models/LikeModel"
import { appConfig } from "../Utils/AppConfig"

class LikeService {
    public async getAllLikes(): Promise<LikeModel[]> {
        const response = await axios.get<LikeModel[]>(appConfig.likesUrl)
        const likes = response.data
        console.log(likes)
        return likes
    }

    public async addLike(like: LikeModel) {
        try {
            const response = await axios.post<LikeModel>(appConfig.likesUrl, like)
            return response.data
        } catch (error) {
            console.log("error liking vacation: ", error)
            throw error            
        }
    }

    public async deleteLike(_id: string) {
        try {
            await axios.delete<LikeModel>(`${appConfig.likesUrl}${_id}`);
        } catch (error) {
            console.error("error unlike vacation:", error)
            throw error
        }
    }

}

export const likeService = new LikeService();