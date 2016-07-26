export interface Project {
  id: string;
  name: string;
  description?: string;
  branches: string[];
}

export interface ProjectState {
  [id: string]: Project;
};
