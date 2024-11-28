import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResumeType } from '../components/types';
import { RootState } from './store';
import { createTask, runTask } from './service';

interface TaskState {
    accessToken: string;
    job: {
      role: string | null;
      description: string | null;
    }
    result: Array<ResumeType>;
    isTaskCreated: boolean;
    isLoading: boolean;
    successMessage: string | null;
    errorMessage: string | null;
  }
  
const initialState: TaskState = {
    accessToken: '',
    job: {
      role: '',
      description: '',
    },
    result: [],
    isTaskCreated: false,
    isLoading: false,
    successMessage: null,
    errorMessage: null,
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        resetTaskState(state) {
          state.accessToken = '';
          state.job = {
            role: null,
            description: null,
          };
          state.result = [];
          state.isTaskCreated = false;
          state.isLoading = false;
          state.successMessage = null;
          state.errorMessage = null;
        },
        updateJobDetails(state, action: PayloadAction<{ role: string | null; description: string | null }>) {
          state.job = {
            role: action.payload.role,
            description: action.payload.description,
          };
        },
        clearMessages(state) {
          state.successMessage = null;
          state.errorMessage = null;
        },
    },      
    extraReducers: (builder) => {
        builder
          // Handle createTask async action
          .addCase(createTask.pending, (state) => {
            state.isLoading = true;
            state.successMessage = null;
            state.errorMessage = null;
          })
          .addCase(createTask.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isTaskCreated = true;
            state.accessToken = action.payload.access_token;
            state.successMessage = action.payload.message;
          })
          .addCase(createTask.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload as string;
          })
          // Handle runTask async action
          .addCase(runTask.pending, (state) => {
            state.isLoading = true;
            state.successMessage = null;
            state.errorMessage = null;
          })
          .addCase(runTask.fulfilled, (state, action) => {
            state.isLoading = false;
            state.result = action.payload;
            state.successMessage = action.payload.message;
          })
          .addCase(runTask.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload as string;
          });
      },
    });
    
    export const {resetTaskState, updateJobDetails, clearMessages} = taskSlice.actions;
    export const taskSelector = (state: RootState) => state.task;
    export default taskSlice.reducer;