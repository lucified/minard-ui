export interface Project {
  id: string;
  name: string;
}

export interface ProjectState {
  [id: string]: Project;
}

export const getIDs = (projects: ProjectState) => Object.keys(projects);
