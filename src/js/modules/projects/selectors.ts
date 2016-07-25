import { getIDs as modelGetIDs } from './model';

export const getIDs = (state: any) => modelGetIDs(state.entities.projects);
export const getName = (state: any, id: string): string => state.entities.projects[id].name;
