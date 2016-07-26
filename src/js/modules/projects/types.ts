export interface Project {
  id: string;
  name: string;
}

export interface ProjectState {
  [id: string]: Project;
};
