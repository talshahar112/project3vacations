import { Action, PayloadAction } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";
import { VacationModel } from "../Models/VacationModel";


export function initUser(currentState: UserModel, action: PayloadAction<UserModel>) {
    const newState: UserModel = action.payload;
    return newState;
}

export function logoutUser(currentState: UserModel, action: Action) {
    const newState: UserModel = null;
    return newState;
}

export function initVacations(currentState: VacationModel[], action: PayloadAction<VacationModel[]>) {
    const newState: VacationModel[] = action.payload;
    console.log("initializing vacations with: ", newState)
    return newState;
}

export function addVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>) {
    return [...currentState, action.payload]
}

export function editVacation(currentState: VacationModel[], action: PayloadAction<VacationModel>) {
    const updatedVacation = action.payload
    const newState: VacationModel[] = currentState.map((vacation) => 
    vacation._id === updatedVacation._id ? updatedVacation : vacation)
    return newState;
}

export function deleteVacation(currentState: VacationModel[], action: PayloadAction<string>) {
    const vacationId = action.payload
    const newState: VacationModel[] = currentState.filter((vacation) => 
    vacation._id !== vacationId )
    return newState;
}

