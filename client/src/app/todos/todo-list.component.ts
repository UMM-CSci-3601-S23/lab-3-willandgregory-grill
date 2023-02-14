import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo, TodoStatus } from './todo';
import { TodoService } from './todo.service';

// @Component({
//   selector: 'app-todo-list',
//   templateUrl: './todo-list.component.html',
//   styleUrls: ['./todo-list.component.scss']
// })
// export class TodoListComponent {

// }



/**
 * A component that displays a list of todos, either as a grid
 * of cards or as a vertical list.
 *
 * The component supports local filtering by name and/or company,
 * and remote filtering (i.e., filtering by the server) by
 * role and/or age. These choices are fairly arbitrary here,
 * but in "real" projects you want to think about where it
 * makes the most sense to do the filtering.
 */
@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  providers: []
})
export class TodoListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredTodos: Todo[];
  public filteredTodos: Todo[];

  public todoOwner: string;
  public todoStatus: TodoStatus;
  public todoBody: string;
  public todoCategory: string;
  public viewType: 'card' | 'list' = 'card';

  /**
   * This constructor injects both an instance of `TodoService`
   * and an instance of `MatSnackBar` into this component.
   *
   * @param todoService the `TodoService` used to get todos from the server
   * @param snackBar the `MatSnackBar` used to display feedback
   */
  constructor(private todoService: TodoService, private snackBar: MatSnackBar) {
    // Nothing here – everything is in the injection parameters.
  }

  /**
   * Get the todos from the server, filtered by the role and age specified
   * in the GUI.
   */
  getTodosFromServer() {
    this.todoService.getTodos({
      role: this.todoRole,
      age: this.todoAge
    }).subscribe(returnedTodos => {
      // This inner function passed to `subscribe` will be called
      // when the `Observable` returned by `getTodos()` has one
      // or more values to return. `returnedTodos` will be the
      // name for the array of `Todos` we got back from the
      // server.
      this.serverFilteredTodos = returnedTodos;
      this.updateFilter();
    }, err => {
      // If there was an error getting the todos, log
      // the problem and display a message.
      console.error('We couldn\'t get the list of todos; the server might be down');
      this.snackBar.open(
        'Problem contacting the server – try again',
        'OK',
        // The message will disappear after 3 seconds.
        { duration: 3000 });
    });
  }

  /**
   * Called when the filtering information is changed in the GUI so we can
   * get an updated list of `filteredTodos`.
   */
  public updateFilter() {
    this.filteredTodos = this.todoService.filterTodos(
      this.serverFilteredTodos, { name: this.todoName, company: this.todoCompany }
    );
  }

  /**
   * Starts an asynchronous operation to update the todos list
   */
  ngOnInit(): void {
    this.getTodosFromServer();
  }
}
