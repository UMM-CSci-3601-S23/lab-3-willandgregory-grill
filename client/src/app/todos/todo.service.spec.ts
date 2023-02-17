import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from './todo';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  // A small collection of test todos
  const testTodos: Todo[] = [
    {_id:'58895985a22c04e761776d54',
    owner: 'Blanche',
    status: 'incomplete',
    body:'the owners bond, james bond.',
    category:'software design'},

    {_id:'58895985c1849992336c219b',
    owner: 'Fry',
    status: 'incomplete',
    body:'Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
    category:'video games'},

    {_id:'58895985ae3b752b124e7663',
    owner: 'Bob',
    status: 'complete',
    body:'I came, I saw, I conquored.',
    category:'apple picking'},
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

      it('correctly calls api/todos with filter parameter \'status\'', () => {
        todoService.getTodos({ status: 'complete' }).subscribe(
          todos => expect(todos.length > 0)
        );

        // Specify that (exactly) one request will be made to the specified URL with the status parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('status')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the status parameter was 'complete'
        expect(req.request.params.get('status')).toEqual('complete');

        req.flush(testTodos);
      });

      it('correctly calls api/todos with filter parameter \'body\'', () => {

        todoService.getTodos({ body: 'I came, I saw, I conquored.'}).subscribe(
          todos => expect(todos.length > 0)
        );

        // Specify that (exactly) one request will be made to the specified URL with the age parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl) && request.params.has('body')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the age parameter was '25'
        expect(req.request.params.get('body')).toEqual('I came, I saw, I conquored.');

        req.flush(testTodos);
      });

      it('correctly calls api/todos with multiple filter parameters', () => {

        todoService.getTodos({ body: 'the owners bond, james bond.', status: 'incomplete'}).subscribe(
          todos => expect(todos.length > 0)
        );

        // Specify that (exactly) one request will be made to the specified URL with the role parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todoService.todoUrl)
            && request.params.has('body') && request.params.has('status')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role, category, and age parameters are correct
        expect(req.request.params.get('body')).toEqual('the owners bond, james bond.');
        expect(req.request.params.get('status')).toEqual('incomplete');


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
    /**  Body, owner and category are all filtered by angular.\
     * This tests their functionality and how them woring with each other.
     */


    it('filters by owner', () => {
      const todoOwner = 'blanche';
      const filteredTodos = todoService.filterTodos(testTodos, { owner: todoOwner });

      expect(filteredTodos.length).toBe(30);
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by category', () => {
      const todoCategory = 'software';
      const filteredTodos = todoService.filterTodos(testTodos, { category: todoCategory });
      expect(filteredTodos.length).toBe(1);

      filteredTodos.forEach(todo => {
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by owner and category', () => {
      const todoOwner = 'b';
      const todoCategory = 'M';
      const filters = { owner: todoOwner, category: todoCategory };
      const filteredTodos = todoService.filterTodos(testTodos, filters);
      // There should be just one todo with these properties.
      expect(filteredTodos.length).toBe(5);
      // Every returned todo should have _both_ these properties.
      filteredTodos.forEach(todo => {
        expect(todo.owner.indexOf(todoOwner)).toBeGreaterThanOrEqual(0);
        expect(todo.category.indexOf(todoCategory)).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
