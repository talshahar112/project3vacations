import express, { NextFunction, Request, Response } from 'express'
import { securityMiddleware } from '../6-middleware/security-middleware'
import { VacationModel } from '../3-models/vacation-model'
import { vacationService } from '../4-services/vacation-service'
import { StatusCode } from '../3-models/enums'
import { UploadedFile } from 'express-fileupload'
import path from 'path'
import { appConfig } from '../2-utils/app-config'
import { fileSaver } from 'uploaded-file-saver'

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
                // respond with an error if no image is uploaded
        }
       const imageFile = request.files.image as UploadedFile
    //    cast the uploaded file to the uploaded file type
       const imagePath = path.join(__dirname, "..", "1-assets", imageFile.name)
    //    define the path to uploaded image
       imageFile.mv(imagePath, (err) => {
        if (err) {
            return next(err)
            // handle errors during file saving
        }
       })
       const imageName = appConfig.baseImageUrl + imageFile.name.trim()
    //    construct the image url to store in the image DB
       const vacation = new VacationModel({
        ...request.body,
        image: imageName
       })
    //   create a new vacation instance with the provided data and image url 
       const addedVacation = await vacationService.addVacation(vacation)
    //    call the service to add the vacation to the DB
       response.status(StatusCode.Created).json(addedVacation)
    //    respond with HTTP 201 status and the added vacation data
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
        // check if there is a new image file
        let imageName: string | undefined = undefined
        if (request.files && request.files.image) {
            const imageFile = request.files.image as UploadedFile
            // generate image path and move the image to the server
            const imagePath = path.join(__dirname, "..", "1-assets", imageFile.name)
            imageFile.mv(imagePath, (err) => {
                if (err) {
                    return next(err)
                }
            })
            // create the image URL to be stored in the DB 
            imageName = appConfig.baseImageUrl + imageFile.name.trim()
        }
        // if an image is provided, update the image field
        const updatedVacationData = {...request.body, ...(imageName && {image: imageName})} //only include image if a new one is uploaded
        const vacation = new VacationModel(updatedVacationData)
        // call the service to update the vacation
        const updatedVacation = await vacationService.editVacation(vacation)
        // send the updated vacation back to the client
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
    // handler to retrieve an image file by its name
    try {
        const imageName = request.params.image
        // extract the image name from the request parameter
        const imagePath = await vacationService.getVacationImage(imageName)
        // image path get the full path from the service
        response.sendFile(imagePath)
        // send the image file as a respond
        }
    catch (err: any) {
     next(err);
}
}

}

const vacationController = new VacationController()
export const vacationRouter = vacationController.router