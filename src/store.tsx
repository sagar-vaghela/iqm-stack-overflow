import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import QuestionReducer from './questions/QuestionSlice'

const rootReducer = combineReducers({
    QuestionReducer
})

const store = configureStore({
    reducer:rootReducer
});

export default store

