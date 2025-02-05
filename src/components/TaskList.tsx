"use client"
import React, { useState, useEffect } from 'react';
import { FaTrash, FaCheck, FaPlus, FaEdit, FaGripVertical } from 'react-icons/fa';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, fetchTasks, createTask, updateTask, deleteTask, validateTask } from "@/hooks/Query";

interface SortableTaskItemProps {
  task: Task;
  isDarkMode: boolean;
  onToggleStatus: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({ task, isDarkMode, onToggleStatus, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-6 rounded-lg backdrop-blur-sm border ${
        task.status === 'COMPLETED'
          ? (isDarkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-100 border-green-200')
          : (isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white border-gray-200')
      } hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>{task.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            {...attributes}
            {...listeners}
            className={`p-2 rounded-lg backdrop-blur-sm ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300 cursor-grab active:cursor-grabbing`}
          >
            <FaGripVertical className={isDarkMode ? 'text-gray-300' : 'text-gray-500'} />
          </button>
          <button
            onClick={() => onToggleStatus(task.id!)}
            className={`p-2 rounded-lg backdrop-blur-sm ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300`}
          >
            <FaCheck className="text-green-500" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className={`p-2 rounded-lg backdrop-blur-sm ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300`}
          >
            <FaEdit className="text-yellow-500" />
          </button>
          <button
            onClick={() => onDelete(task.id!)}
            className={`p-2 rounded-lg backdrop-blur-sm ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-300`}
          >
            <FaTrash className="text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskComponent: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({ title: '', description: '', status: 'PENDING' });
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const loadTasks = async () => {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    };
    loadTasks();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);
        
        return arrayMove(tasks, oldIndex, newIndex);
      });
      
    }
  };

  const handleCreateTask = async () => {
    if (!validateTask(newTask)) {
      alert('Task title cannot be empty!');
      return;
    }
    const createdTask = await createTask(newTask);
    setTasks([...tasks, createdTask]);
    setNewTask({ title: '', description: '', status: 'PENDING' });
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
  };

  const handleUpdateTask = async () => {
    if (!editTask || !validateTask(editTask)) return;
    const updatedTask = await updateTask(editTask.id!, editTask);
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    setEditTask(null);
  };

  const handleToggleStatus = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updatedTask = await updateTask(id, { status: task.status === 'PENDING' ? 'COMPLETED' : 'PENDING' });
    setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
  };

  const handleDeleteConfirm = (id: number) => {
    setTaskToDelete(id);
    setIsDeleteConfirm(true);
  };

  const handleDeleteTask = async () => {
    if (taskToDelete === null) return;
    await deleteTask(taskToDelete);
    setTasks(tasks.filter((t) => t.id !== taskToDelete));
    setIsDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-900 placeholder-gray-500'} transition-colors duration-300`}>
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Task Manager
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full p-3 mb-6 rounded-lg backdrop-blur-sm ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
        />

        <div className={`mb-8 p-6 rounded-lg backdrop-blur-sm ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white border-gray-200'} border`}>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className={`w-full p-3 mb-4 rounded-lg backdrop-blur-sm ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
          />
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className={`w-full p-3 mb-4 rounded-lg backdrop-blur-sm ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
          />
          <button
            onClick={handleCreateTask}
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Task
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTasks.map(task => task.id!)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  isDarkMode={isDarkMode}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteConfirm}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {editTask && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4">
          <div className={`${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-lg border p-6 w-full max-w-md`}>
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
            <input
              type="text"
              value={editTask.title}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              className={`w-full p-3 mb-4 rounded-lg backdrop-blur-sm ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
            />
            <textarea
              value={editTask.description}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              className={`w-full p-3 mb-4 rounded-lg backdrop-blur-sm ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-gray-100 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
            />
            <button
              onClick={handleUpdateTask}
              className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {isDeleteConfirm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex justify-center items-center p-4">
          <div className={`${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-sm rounded-lg border p-6 w-full max-w-md`}>
            <h2 className="text-2xl font-bold mb-4">Delete Task</h2>
            <p className="mb-6">Are you sure you want to delete this task?</p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteTask}
                className="flex-1 p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all duration-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDeleteConfirm(false)}
                className="flex-1 p-3 bg-gray-500/10 text-gray-500 rounded-lg hover:bg-gray-500/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskComponent;