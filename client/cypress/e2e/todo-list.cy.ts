// import { TodoListPage } from '../support/todo-list.po';

// const page = new TodoListPage();

// describe('Todo list', () => {

//   beforeEach(() => {
//     page.navigateTo();
//   });

//   it('Should have the correct title', () => {
//     page.getTodoTitle().should('have.text', 'Todos');
//   });

//   it('Should type something in the name filter and check that it returned correct elements', () => {
//     // Filter for todo 'Blanche'
//     cy.get('[data-test=todoNameInput]').type('Blanche');

//     // All of the todo cards should have the name we are filtering by
//     page.getTodoCards().each($card => {
//       cy.wrap($card).find('.todo-card-name').should('have.text', 'Blanche');
//     });

//     // (We check this two ways to show multiple ways to check this)
//     page.getTodoCards().find('.todo-card-name').each($name =>
//       expect($name.text()).to.equal('Blanche')
//     );
//   });

//   it('Should type something in the company filter and check that it returned correct elements', () => {
//     // Filter for company 'OHMNET'
//     cy.get('[data-test=todoCompanyInput]').type('OHMNET');

//     page.getTodoCards().should('have.lengthOf.above', 0);

//     // All of the todo cards should have the company we are filtering by
//     page.getTodoCards().find('.todo-card-company').each($card => {
//       cy.wrap($card).should('have.text', 'OHMNET');
//     });
//   });

//   it('Should type something partial in the company filter and check that it returned correct elements', () => {
//     // Filter for companies that contain 'ti'
//     cy.get('[data-test=todoCompanyInput]').type('ti');

//     page.getTodoCards().should('have.lengthOf', 2);

//     // Each todo card's company name should include the text we are filtering by
//     page.getTodoCards().each(e => {
//       cy.wrap(e).find('.todo-card-company').should('include.text', 'TI');
//     });
//   });

//   it('Should type something in the age filter and check that it returned correct elements', () => {
//     // Filter for todos of age '27'
//     cy.get('[data-test=todoAgeInput]').type('27');

//     page.getTodoCards().should('have.lengthOf', 3);

//     // Go through each of the cards that are being shown and get the names
//     page.getTodoCards().find('.todo-card-name')
//       // We should see these todos whose age is 27
//       .should('contain.text', 'Stokes Clayton')
//       .should('contain.text', 'Bolton Monroe')
//       .should('contain.text', 'Merrill Parker')
//       // We shouldn't see these todos
//       .should('not.contain.text', 'Connie Stewart')
//       .should('not.contain.text', 'Blanche');
//   });

//   it('Should change the view', () => {
//     // Choose the view type "List"
//     page.changeView('list');

//     // We should not see any cards
//     // There should be list items
//     page.getTodoCards().should('not.exist');
//     page.getTodoListItems().should('exist');

//     // Choose the view type "Card"
//     page.changeView('card');

//     // There should be cards
//     // We should not see any list items
//     page.getTodoCards().should('exist');
//     page.getTodoListItems().should('not.exist');
//   });

//   it('Should select a role, switch the view, and check that it returned correct elements', () => {
//     // Filter for role 'viewer');
//     page.selectRole('viewer');

//     // Choose the view type "List"
//     page.changeView('list');

//     // Some of the todos should be listed
//     page.getTodoListItems().should('have.lengthOf.above', 0);

//     // All of the todo list items that show should have the role we are looking for
//     page.getTodoListItems().each($todo => {
//       cy.wrap($todo).find('.todo-list-role').should('contain', 'viewer');
//     });
//   });

//   it('Should click view profile on a todo and go to the right URL', () => {
//     page.getTodoCards().first().then((card) => {
//       const firstTodoName = card.find('.todo-card-name').text();
//       const firstTodoCompany = card.find('.todo-card-company').text();

//       // When the view profile button on the first todo card is clicked, the URL should have a valid mongo ID
//       page.clickViewProfile(page.getTodoCards().first());

//       // The URL should contain '/todos/' (note the ending slash) and '/todos/' should be followed by a mongo ID
//       cy.url()
//         .should('contain', '/todos/')
//         .should('match', /.*\/todos\/[0-9a-fA-F]{24}$/);

//       // On this profile page we were sent to, the name and company should be correct
//       cy.get('.todo-card-name').first().should('have.text', firstTodoName);
//       cy.get('.todo-card-company').first().should('have.text', firstTodoCompany);
//     });
//    });

// });
