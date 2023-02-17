export interface Todo {
  _id: string;
  owner: string;
  body: string;
  category: string;
  // avatar?: string;
  status: TodoStatus;
}

export type TodoStatus = 'complete' | 'incomplete' ;
