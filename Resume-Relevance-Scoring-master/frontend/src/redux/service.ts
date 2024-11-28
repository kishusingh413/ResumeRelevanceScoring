import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
})

export const createTask = createAsyncThunk(
  'task/create',
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await client.post('/api/v1/create-task/', config);
      return data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
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
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
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
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
