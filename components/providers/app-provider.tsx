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
  upsertTask: (input: TaskInput) => ActionResult<Task>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
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
        upsertTask,
        updateTaskStatus,
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
