import axios from 'axios';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'COMPLETED';
}


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axios.get<Task[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};


export const createTask = async (taskData: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const response = await axios.post<Task>(BASE_URL, taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id: number, updateData: Partial<Task>): Promise<Task> => {
  try {
    const response = await axios.put<Task>(`${BASE_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const validateTask = (task: Partial<Task>): boolean => {
  return !!task.title && task.title.trim().length > 0;
};