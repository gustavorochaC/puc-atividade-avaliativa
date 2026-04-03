"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { createSeedData } from "@/lib/seed-data";
import type {
  AppState,
  LoginInput,
  Project,
  ProjectInput,
  RegisterInput,
  Session,
  Task,
  TaskInput,
  TaskStatus,
  User,
} from "@/lib/types";

const STORAGE_KEY = "sgto:mvp-state";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; message: string };

type AppContextValue = {
  ready: boolean;
  state: AppState;
  currentUser: User | null;
  login: (input: LoginInput) => ActionResult<User>;
  register: (input: RegisterInput) => ActionResult<User>;
  logout: () => void;
  upsertProject: (input: ProjectInput) => ActionResult<Project>;
  deleteProject: (
    projectId: string,
  ) => ActionResult<{ project: Project; removedTaskCount: number }>;
  upsertTask: (input: TaskInput) => ActionResult<Task>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  moveTask: (taskId: string, status: TaskStatus, beforeTaskId: string | null) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const emptyState: AppState = {
  users: [],
  session: null,
  projects: [],
  tasks: [],
};

function readState(): AppState {
  if (typeof window === "undefined") {
    return emptyState;
  }

  const fallback = createSeedData();
  const rawState = window.localStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawState) as Partial<AppState>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : fallback.users,
      session: parsed.session ?? null,
      projects: Array.isArray(parsed.projects) ? parsed.projects : fallback.projects,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : fallback.tasks,
    };
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

function persistState(state: AppState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function buildSession(userId: string): Session {
  return {
    userId,
    loggedInAt: new Date().toISOString(),
  };
}

export function AppProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AppState>(emptyState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initialState = readState();
    const frame = window.requestAnimationFrame(() => {
      setState(initialState);
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    persistState(state);
  }, [ready, state]);

  const currentUser =
    state.session === null
      ? null
      : state.users.find((user) => user.id === state.session?.userId) ?? null;

  const login = ({ email, password }: LoginInput): ActionResult<User> => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = state.users.find(
      (item) =>
        item.email.trim().toLowerCase() === normalizedEmail &&
        item.password === password,
    );

    if (!user) {
      return {
        success: false,
        message: "E-mail ou senha invalidos.",
      };
    }

    setState((current) => ({
      ...current,
      session: buildSession(user.id),
    }));

    return {
      success: true,
      data: user,
    };
  };

  const register = ({ name, email, password }: RegisterInput): ActionResult<User> => {
    const normalizedEmail = email.trim().toLowerCase();

    if (
      state.users.some((user) => user.email.trim().toLowerCase() === normalizedEmail)
    ) {
      return {
        success: false,
        message: "Ja existe um usuario com esse e-mail.",
      };
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    setState((current) => ({
      ...current,
      users: [...current.users, user],
      session: buildSession(user.id),
    }));

    return {
      success: true,
      data: user,
    };
  };

  const logout = () => {
    setState((current) => ({
      ...current,
      session: null,
    }));
  };

  const upsertProject = (input: ProjectInput): ActionResult<Project> => {
    const now = new Date().toISOString();
    const project: Project = {
      id: input.id ?? crypto.randomUUID(),
      name: input.name.trim(),
      description: input.description.trim(),
      dueDate: input.dueDate,
      memberIds: input.memberIds,
      createdAt:
        input.id !== undefined
          ? state.projects.find((item) => item.id === input.id)?.createdAt ?? now
          : now,
    };

    setState((current) => ({
      ...current,
      projects: current.projects.some((item) => item.id === project.id)
        ? current.projects.map((item) => (item.id === project.id ? project : item))
        : [project, ...current.projects],
    }));

    return {
      success: true,
      data: project,
    };
  };

  const deleteProject = (
    projectId: string,
  ): ActionResult<{ project: Project; removedTaskCount: number }> => {
    const project = state.projects.find((item) => item.id === projectId);

    if (!project) {
      return {
        success: false,
        message: "Projeto nao encontrado.",
      };
    }

    const removedTaskCount = state.tasks.filter(
      (task) => task.projectId === projectId,
    ).length;

    setState((current) => ({
      ...current,
      projects: current.projects.filter((item) => item.id !== projectId),
      tasks: current.tasks.filter((task) => task.projectId !== projectId),
    }));

    return {
      success: true,
      data: {
        project,
        removedTaskCount,
      },
    };
  };

  const upsertTask = (input: TaskInput): ActionResult<Task> => {
    const now = new Date().toISOString();
    const previousTask = input.id
      ? state.tasks.find((item) => item.id === input.id)
      : undefined;

    const task: Task = {
      id: input.id ?? crypto.randomUUID(),
      projectId: input.projectId,
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      priority: input.priority,
      assigneeId: input.assigneeId,
      dueDate: input.dueDate,
      createdAt: previousTask?.createdAt ?? now,
      completedAt:
        input.status === "done"
          ? previousTask?.completedAt ?? now
          : null,
    };

    setState((current) => ({
      ...current,
      tasks: current.tasks.some((item) => item.id === task.id)
        ? current.tasks.map((item) => (item.id === task.id ? task : item))
        : [task, ...current.tasks],
    }));

    return {
      success: true,
      data: task,
    };
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              completedAt: status === "done" ? task.completedAt ?? new Date().toISOString() : null,
            }
          : task,
      ),
    }));
  };

  const moveTask = (taskId: string, status: TaskStatus, beforeTaskId: string | null) => {
    setState((current) => {
      const taskToMove = current.tasks.find((task) => task.id === taskId);

      if (!taskToMove) {
        return current;
      }

      const remainingTasks = current.tasks.filter((task) => task.id !== taskId);
      const nextTask = {
        ...taskToMove,
        status,
        completedAt: status === "done" ? taskToMove.completedAt ?? new Date().toISOString() : null,
      };

      let insertIndex = remainingTasks.length;

      if (beforeTaskId) {
        const beforeIndex = remainingTasks.findIndex((task) => task.id === beforeTaskId);

        if (beforeIndex >= 0) {
          insertIndex = beforeIndex;
        }
      } else {
        const lastStatusIndex = remainingTasks.reduce((lastIndex, task, index) => {
          return task.status === status ? index : lastIndex;
        }, -1);

        if (lastStatusIndex >= 0) {
          insertIndex = lastStatusIndex + 1;
        }
      }

      const nextTasks = [...remainingTasks];
      nextTasks.splice(insertIndex, 0, nextTask);

      return {
        ...current,
        tasks: nextTasks,
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        ready,
        state,
        currentUser,
        login,
        register,
        logout,
        upsertProject,
        deleteProject,
        upsertTask,
        updateTaskStatus,
        moveTask,
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error("useAppStore must be used within AppProvider.");
  }

  return context;
}
