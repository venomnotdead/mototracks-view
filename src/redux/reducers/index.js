import { combineReducers } from "@reduxjs/toolkit";
import { SNACKBAR_EVENT } from '../actions';

const snackbarProvider = (state = {}, action) => {
    switch (action.type) {
        case SNACKBAR_EVENT:
            return action.payload;
        default:
            return state;
    }
};



const rootReducer = combineReducers({
    snackBarData: snackbarProvider,
});

export default rootReducer;