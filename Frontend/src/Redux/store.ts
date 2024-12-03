import { configureStore, createSlice } from "@reduxjs/toolkit";
// import { ProductModel } from "../Models/ProductModel";
import { addVacation, deleteVacation, editVacation, initUser, initVacations, logoutUser } from "./reducers";
import { UserModel } from "../Models/UserModel";
import { VacationModel } from "../Models/VacationModel";

// Application state:
export type AppState = {
    user: UserModel;
    vacations: VacationModel[];
};

// Create user slice: 
const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers: { initUser, logoutUser }
});

const vacationSlice = createSlice({
    name:"vacations",
    initialState: [] as VacationModel[],
    reducers: {initVacations, addVacation, deleteVacation, editVacation}
});

// Creating action creators: 
export const userActions = userSlice.actions;
export const vacationActions = vacationSlice.actions;

// Main redux object:
export const store = configureStore<AppState>({
    reducer: {
        user: userSlice.reducer, // User state
        vacations: vacationSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
