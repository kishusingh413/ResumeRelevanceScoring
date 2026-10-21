import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || '',
})

const apiErrorMessage = (error: any) =>
  error.response?.data?.error || error.response?.data?.message || error.message;

export const createTask = createAsyncThunk(
  'task/create',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.post('/api/v1/create-task/', {});
      return data;
    } catch (error: any) {
      return rejectWithValue(apiErrorMessage(error));
    }
  }
);

export const runTask = createAsyncThunk(
  'task/run',
  async (_, { getState, rejectWithValue }) => {
    const { task } = getState() as { task: any };
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${task.accessToken}`,
        },
      };
      const { data } = await client.put('/api/v1/run-task/', task.job, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(apiErrorMessage(error));
    }
  }
);

export const addResumes = createAsyncThunk(
  'task/upload_files',
  async ({ files }: { files: FormData }, { getState, rejectWithValue }) => {
    const { task } = getState() as { task: { accessToken: string } };
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${task.accessToken}`,
        },
      };
      const response = await client.post(
        '/api/v1/upload-files/',
        files,
        config,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(apiErrorMessage(error));
    }
  }
);
