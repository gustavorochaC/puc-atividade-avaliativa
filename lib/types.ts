export type TaskStatus = "todo" | "doing" | "done";

export type TaskPriority = "low" | "medium" | "high";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export type Session = {
  userId: string;
  loggedInAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  memberIds: string[];
  createdAt: string;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  createdAt: string;
  completedAt: string | null;
};

export type AppState = {
  users: User[];
  session: Session | null;
  projects: Project[];
  tasks: Task[];
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type ProjectInput = Omit<Project, "id" | "createdAt"> & {
  id?: string;
};

export type TaskInput = Omit<Task, "id" | "createdAt" | "completedAt"> & {
  id?: string;
};
