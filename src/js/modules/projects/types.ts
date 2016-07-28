export interface Project {
  id: string;
  name: string;
  description?: string;
  branches: string[];
  activeUsers: string[];
}

export interface ProjectState {
  [id: string]: Project;
};
