import { ResourceNotFoundError, ValidationError } from "../3-models/client-errors";
import { ILikesModel, LikesModel } from "../3-models/likes-model";

class LikeService {
    public async getAllLikes() {
        return await LikesModel.find().exec()
    }

    public async addLike(like: ILikesModel) {
        const error = like.validateSync()
        if(error) throw new ValidationError(error.message)
        return await like.save()
    }

    public async deleteLike(_id: string) {
        const deletedLike = await LikesModel.findByIdAndDelete(_id).exec()
        if (!deletedLike) throw new ResourceNotFoundError(_id)
    }
}

export const likeService = new LikeService();