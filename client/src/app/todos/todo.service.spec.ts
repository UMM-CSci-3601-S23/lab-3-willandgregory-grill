// import { TestBed } from '@angular/core/testing';

// import { TodoService } from './todo.service';

// describe('TodoService', () => {
//   let service: TodoService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(TodoService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  // A small collection of test todos
  const testTodos: Todo[] = [
    {
      _id: 'chris_id',
      name: 'Chris',
      age: 25,
      company: 'UMM',
      email: 'chris@this.that',
      role: 'admin',
      avatar: 'https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon'
    },
    {
      _id: 'pat_id',
      name: 'Pat',
      age: 37,
      company: 'IBM',
      email: 'pat@something.com',
      role: 'editor',
      avatar: 'https://gravatar.com/avatar/b42a11826c3bde672bce7e06ad729d44?d=identicon'
    },
    {
      _id: 'jamie_id',
      name: 'Jamie',
      age: 37,
      company: 'Frogs, Inc.',
      email: 'jamie@frogs.com',
      role: 'viewer',
      avatar: 'https://gravatar.com/avatar/d4a6c71dd9470ad4cf58f78c100258bf?d=identicon'
    }
  ];
  let todoService: TodoService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoService = new TodoService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getTodos()', () => {

    it('calls `api/todos` when `getTodos()` is called with no parameters', () => {
      // Assert that the todos we get from this call to getTodos()
      // should be our set of test todos. Because we're subscribing
      // to the result of getTodos(), this won't actually get
      // checked until the mocked HTTP request 'returns' a response.
      // This happens when we call req.flush(testTodos) a few lines
      // down.
      todoService.getTodos().subscribe(
        todos => expect(todos).toBe(testTodos)
      );

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(todoService.todoUrl);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);
      // Specify the content of the response to that request. This
      // triggers the subscribe above, which leads to that check
      // actually being performed.
      req.flush(testTodos);
    });

    describe('Calling getTodos() with parameters correctly forms the HTTP request', () => {
      /*
       * We really don't care what `getTodos()` returns in the cases
       * where the filtering is happening on the server. Since all the
       * filtering is happening on the server, `getTodos()` is really
       * just a "pass through" that returns whatever it receives, without
       * any "post processing" or manipulation. So the tests in this
       * `describe` block all confirm that the HTTP request is properly formed
       * and sent out in the world, but don't _really_ care about
       * what `getTodos()` returns as long as it's what the HTTP
       * request returns.
       *
       * So in each of these tests, we'll keep it simple and have
       * the (mocked) HTTP request return the entire list `testTodos`
       * even though in "real life" we would expect the server to
       * return return a filtered subset of the todos.
       */

      it('correctly calls api/todos with filter parameter \'admin\'', () => {
        todoService.getTodos({ role: 'admin' }).subscribe(
          todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL with the role parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('role')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role parameter was 'admin'
        expect(req.request.params.get('role')).toEqual('admin');

        req.flush(testTodos);
      });

      it('correctly calls api/todos with filter parameter \'age\'', () => {

        todoService.getTodos({ age: 25 }).subscribe(
          todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL with the age parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('age')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the age parameter was '25'
        expect(req.request.params.get('age')).toEqual('25');

        req.flush(testTodos);
      });

      it('correctly calls api/todos with multiple filter parameters', () => {

        todoService.getTodos({ role: 'editor', company: 'IBM', age: 37 }).subscribe(
          todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL with the role parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl)
            && request.params.has('role') && request.params.has('company') && request.params.has('age')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role, company, and age parameters are correct
        expect(req.request.params.get('role')).toEqual('editor');
        expect(req.request.params.get('company')).toEqual('IBM');
        expect(req.request.params.get('age')).toEqual('37');

        req.flush(testTodos);
      });
    });
  });

  describe('getTodoByID()', () => {
    it('calls api/todos/id with the correct ID', () => {
      // We're just picking a Todo "at random" from our little
      // set of Todos up at the top.
      const targetTodo: Todo = testTodos[1];
      const targetId: string = targetTodo._id;

      todoService.getTodoById(targetId).subscribe(
        // This `expect` doesn't do a _whole_ lot.
        // Since the `targetTodo`
        // is what the mock `HttpClient` returns in the
        // `req.flush(targetTodo)` line below, this
        // really just confirms that `getTodoById()`
        // doesn't in some way modify the todo it
        // gets back from the server.
        todo => expect(todo).toBe(targetTodo)
      );

      const expectedUrl: string = todoService.todoUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodo);
    });
  });

  describe('filterTodos()', () => {
    /*
     * Since `filterTodos` actually filters "locally" (in
     * Angular instead of on the server), we do want to
     * confirm that everything it returns has the desired
     * properties. Since this doesn't make a call to the server,
     * though, we don't have to use the mock HttpClient and
     * all those complications.
     */
    it('filters by name', () => {
      const todoName = 'i';
      const filteredTodos = todoService.filterTodos(testTodos, { name: todoName });
      // There should be two todos with an 'i' in their
      // name: Chris and Jamie.
      expect(filteredTodos.length).toBe(2);
      // Every returned todo's name should contain an 'i'.
      filteredTodos.forEach(todo => {
        expect(todo.name.indexOf(todoName)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by company', () => {
      const todoCompany = 'UMM';
      const filteredTodos = todoService.filterTodos(testTodos, { company: todoCompany });
      // There should be just one todo that has UMM as their company.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo's company should contain 'UMM'.
      filteredTodos.forEach(todo => {
        expect(todo.company.indexOf(todoCompany)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by name and company', () => {
      // There's only one todo (Chris) whose name
      // contains an 'i' and whose company contains
      // an 'M'. There are two whose name contains
      // an 'i' and two whose company contains an
      // an 'M', so this should test combined filtering.
      const todoName = 'i';
      const todoCompany = 'M';
      const filters = { name: todoName, company: todoCompany };
      const filteredTodos = todoService.filterTodos(testTodos, filters);
      // There should be just one todo with these properties.
      expect(filteredTodos.length).toBe(1);
      // Every returned todo should have _both_ these properties.
      filteredTodos.forEach(todo => {
        expect(todo.name.indexOf(todoName)).toBeGreaterThanOrEqual(0);
        expect(todo.company.indexOf(todoCompany)).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
