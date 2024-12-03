import axios from "axios";
import { VacationModel } from "../Models/VacationModel";
import { store, vacationActions } from "../Redux/store";
import { appConfig } from "../Utils/AppConfig";

class VacationService {

    public async getAllVacations(): Promise<VacationModel[]> {
        if (store.getState().vacations.length>0) {
            return store.getState().vacations
        }
        const response = await axios.get(appConfig.vacationsUrl)
        const data = response.data
        const action = vacationActions.initVacations(data)
        store.dispatch(action)
        return data
    }

    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        const response = await axios.post(appConfig.vacationsUrl, vacation, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        vacation.image = response.data.image
        const action = vacationActions.addVacation(response.data)
        store.dispatch(action)
        return response.data
    }

    public async deleteVacation(_id: string) {
        try {
            await axios.delete<VacationModel>(`${appConfig.vacationsUrl}${_id}`);
            const action = vacationActions.deleteVacation(_id)
            store.dispatch(action)
        } catch (error) {
            console.error("error deleting vacation:", error)
            throw error
        }
    }

        public async editVacation(vacation: VacationModel, imageFile: File | null) {
            const formData = new FormData()

            formData.append("destination", vacation.destination)
            formData.append("description", vacation.description)
            formData.append("startDate", vacation.startDate)
            formData.append("endDate", vacation.endDate)
            formData.append("price", vacation.price.toString())

            if (imageFile) {
                formData.append("image", imageFile)
            }

            try {
                const response = await axios.put<VacationModel>(`${appConfig.vacationsUrl}${vacation._id}`, formData,{
                    headers: { "Content-Type": "multipart/form-data"},
                })

                const updatedVacation = response.data
                const action = vacationActions.editVacation(updatedVacation)
                store.dispatch(action)
            } catch (error) {
                console.error("error editing vacation", error)
                throw error
            }
        }

}

export const vacationService = new VacationService();
