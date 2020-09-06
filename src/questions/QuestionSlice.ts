import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestionStore,QuestionData } from './QuestionStore';

const QuestionSlice = createSlice({
  name: 'questions',
  initialState: [] as QuestionStore,
  reducers: {
    getQuestions(state: QuestionStore, action: PayloadAction<QuestionData[]>) {
      console.log('action '+ JSON.stringify(action.payload))
      action.payload.map(x => state.push(x))
      return state
    },
  }
})

export const { getQuestions } = QuestionSlice.actions;

export default QuestionSlice.reducer;