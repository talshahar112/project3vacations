import express, { NextFunction, Request, Response } from 'express'
import { securityMiddleware } from '../6-middleware/security-middleware'
import { VacationModel } from '../3-models/vacation-model'
import { vacationService } from '../4-services/vacation-service'
import { StatusCode } from '../3-models/enums'
import { UploadedFile } from 'express-fileupload'
import path from 'path'
import { appConfig } from '../2-utils/app-config'

class VacationController {
    public readonly router = express.Router()
    public constructor() {
        this.registerRoutes()
    }
    private registerRoutes ():void {
        this.router.get("/vacations", this.getAllVacations, securityMiddleware.verifyLoggedIn)
        this.router.post("/vacations", this.addVacation, securityMiddleware.verifyLoggedIn)
        this.router.put("/vacations/:_id([a-fA-F0-9]{24})", this.editVacation, securityMiddleware.verifyLoggedIn)
        this.router.delete("/vacations/:_id([a-fA-F0-9]{24})", this.deleteVacation, securityMiddleware.verifyLoggedIn)
        this.router.get("/vacations/images/:image", this.getVacationImage, securityMiddleware.verifyLoggedIn)
    }

    private async getAllVacations(request: Request, response: Response, next: NextFunction): Promise<any> {
        try {
            const vacations = await vacationService.getAllVacations()
            response.json(vacations)
        }
        catch (err: any) {
         next(err);
    }
}

private async addVacation(request: Request, response: Response, next: NextFunction) {
    try {
        if (!request.files || !request.files.image) {
            return response
                .status(StatusCode.BadRequest)
                .json({message:"image is required"})
        }
       const imageFile = request.files.image as UploadedFile
       const imagePath = path.join(__dirname, "..", "1-assets", imageFile.name)
       imageFile.mv(imagePath, (err) => {
        if (err) {
            return next(err)
        }
       })
       const imageName = appConfig.baseImageUrl + imageFile.name.trim()
       const vacation = new VacationModel({
        ...request.body,
        image: imageName
       })
       const addedVacation = await vacationService.addVacation(vacation)
       response.status(StatusCode.Created).json(addedVacation)
    }
    catch (err: any) {
        console.log(err)
     next(err);
}
}

private async editVacation(request: Request, response: Response, next: NextFunction) {
    try {
        const _id = request.params._id
        request.body._id = _id
        let imageName: string | undefined = undefined
        if (request.files && request.files.image) {
            const imageFile = request.files.image as UploadedFile
            const imagePath = path.join(__dirname, "..", "1-assets", imageFile.name)
            imageFile.mv(imagePath, (err) => {
                if (err) {
                    return next(err)
                }
            })
            imageName = appConfig.baseImageUrl + imageFile.name.trim()
        }
        const updatedVacationData = {...request.body, ...(imageName && {image: imageName})} //only include image if a new one is uploaded
        const vacation = new VacationModel(updatedVacationData)
        const updatedVacation = await vacationService.editVacation(vacation)
        response.json(updatedVacation)
    }
    catch (err: any) {
     next(err);
}
}

private async deleteVacation(request: Request, response: Response, next: NextFunction): Promise<any> {
    try {
        const _id = request.params._id
        await vacationService.deleteVacation(_id)
        response.sendStatus(StatusCode.NoContent)
        }
    catch (err: any) {
     next(err);
}
}

private async getVacationImage(request: Request, response: Response, next: NextFunction) {
    try {
        const imageName = request.params.image
        const imagePath = await vacationService.getVacationImage(imageName)
        response.sendFile(imagePath)
        }
    catch (err: any) {
     next(err);
}
}

}

const vacationController = new VacationController()
export const vacationRouter = vacationController.router