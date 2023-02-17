import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo, TodoStatus } from '../app/todos/todo';
import { TodoService } from '../app/todos/todo.service';

/**
 * A "mock" version of the `TodoService` that can be used to test components
 * without having to create an actual service. It needs to be `Injectable` since
 * that's how services are typically provided to components.
 */
@Injectable()
export class MockTodoService extends TodoService {
  static testTodos: Todo[] = [
    {
      _id:'58895985a22c04e761776d54',
    owner: 'Blanche',
    status: 'incomplete',
    body:'the owners bond, james bond.',
    category:'software design'
    },
    {
      _id:'58895985c1849992336c219b',
    owner: 'Fry',
    status: 'incomplete',
    body:'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
    category:'video games'
    },
    {
      _id:'58895985ae3b752b124e7663',
    owner: 'Bob',
    status: 'complete',
    body:'I came, I saw, I conquored.',
    category:'apple picking'
    }
  ];

  constructor() {
    super(null);
  }

  getTodos(filters: { status?: TodoStatus; owner?: string; body?: string; category?: string  }): Observable<Todo[]> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test todos regardless of what
    // filters are passed in.
    //
    // The `of()` function converts a regular object or value into an
    // `Observable` of that object or value.
    return of(MockTodoService.testTodos);
  }

  getTodoById(id: string): Observable<Todo> {
    // If the specified ID is for the first test todo,
    // return that todo, otherwise return `null` so
    // we can test illegal todo requests.
    if (id === MockTodoService.testTodos[0]._id) {
      return of(MockTodoService.testTodos[0]);
    } else {
      return of(null);
    }
  }

}
