// Type definitions for history v2.0.0
// Project: https://github.com/rackt/history
// Definitions by: Sergey Buturlakin <https://github.com/sergey-buturlakin>, Nathan Brown <https://github.com/ngbrown>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// types based on https://github.com/rackt/history/blob/master/docs/Terms.md

export as namespace History;

export type Action = string;
export type BeforeUnloadHook = () => string | boolean;
export type CreateHistory<T> = (options?: HistoryOptions) => T;
export type CreateHistoryEnhancer<T, E> = (createHistory: CreateHistory<T>) => CreateHistory<T & E>;

export interface History {
    listenBefore(hook: TransitionHook): () => void;
    listen(listener: LocationListener): () => void;
    transitionTo(location: Location): void;
    push(path: LocationDescriptor): void;
    replace(path: LocationDescriptor): void;
    go(n: number): void;
    goBack(): void;
    goForward(): void;
    createKey(): LocationKey;
    createPath(path: LocationDescriptor): Path;
    createHref(path: LocationDescriptor): Href;
    createLocation(path?: LocationDescriptor, action?: Action, key?: LocationKey): Location;

    /** @deprecated use a location descriptor instead */
    createLocation(path?: Path, state?: LocationState, action?: Action, key?: LocationKey): Location;
    /** @deprecated use location.key to save state instead */
    pushState(state: LocationState, path: Path): void;
    /** @deprecated use location.key to save state instead */
    replaceState(state: LocationState, path: Path): void;
    /** @deprecated use location.key to save state instead */
    setState(state: LocationState): void;
    /** @deprecated use listenBefore instead */
    registerTransitionHook(hook: TransitionHook): void;
    /** @deprecated use the callback returned from listenBefore instead */
    unregisterTransitionHook(hook: TransitionHook): void;
}

export type HistoryOptions = {
    getCurrentLocation?: () => Location;
    finishTransition?: (nextLocation: Location) => boolean;
    saveState?: (key: LocationKey, state: LocationState) => void;
    go?: (n: number) => void;
    getUserConfirmation?: (message: string, callback: (result: boolean) => void) => void;
    keyLength?: number;
    queryKey?: string | boolean;
    stringifyQuery?: (obj: any) => string;
    parseQueryString?: (str: string) => any;
    basename?: string;
    entries?: string | [any];
    current?: number;
}

export type Href = string

export type Location = {
    pathname: Pathname;
    search: Search;
    query: Query;
    state: LocationState;
    action: Action;
    key: LocationKey;
    basename?: string;
};

export type LocationDescriptorObject = {
    pathname?: Pathname;
    search?: Search;
    query?: Query;
    state?: LocationState;
};

export type LocationDescriptor = LocationDescriptorObject | Path;
export type LocationKey = string;
export type LocationListener = (location: Location) => void;
export type LocationState = Object;
export type Path = string // Pathname + QueryString;
export type Pathname = string;
export type Query = Object;
export type QueryString = string;
export type Search = string;

export type TransitionHook = (location: Location, callback: (result: any) => void) => any


export interface HistoryBeforeUnload {
    listenBeforeUnload(hook: BeforeUnloadHook): () => void;
}

export interface HistoryQueries {
    pushState(state: LocationState, pathname: Pathname | Path, query?: Query): void;
    replaceState(state: LocationState, pathname: Pathname | Path, query?: Query): void;
    createPath(path: Path, query?: Query): Path;
    createHref(path: Path, query?: Query): Href;
}


// Global usage, without modules, needs the small trick, because lib.d.ts
// already has `history` and `History` global definitions:
// var createHistory = ((window as any).History as HistoryModule.Module).createHistory;
export interface Module {
    createHistory: CreateHistory<History>;
    createHashHistory: CreateHistory<History>;
    createMemoryHistory: CreateHistory<History>;
    createLocation(path?: Path, state?: LocationState, action?: Action, key?: LocationKey): Location;
    useBasename<T>(createHistory: CreateHistory<T>): CreateHistory<T>;
    useBeforeUnload<T>(createHistory: CreateHistory<T>): CreateHistory<T & HistoryBeforeUnload>;
    useQueries<T>(createHistory: CreateHistory<T>): CreateHistory<T & HistoryQueries>;
    actions: {
        PUSH: string;
        REPLACE: string;
        POP: string;
    };
}

// Created the exports below based on https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/react-router/history.d.ts
export function createHistory(options?: HistoryOptions): History;
export function createHashHistory(options?: HistoryOptions): History;
export function createMemoryHistory(options?: HistoryOptions): History;
export function createLocation(path?: Path, state?: LocationState, action?: Action, key?: LocationKey): Location;
export function useBasename<T>(createHistory: CreateHistory<T>): CreateHistory<T>;
export function useBeforeUnload<T>(createHistory: CreateHistory<T>): CreateHistory<T & HistoryBeforeUnload>;
export function useQueries<T>(createHistory: CreateHistory<T>): CreateHistory<T & HistoryQueries>;

declare module Actions {
    export const PUSH: string
    export const REPLACE: string
    export const POP: string
}

export { Actions };
