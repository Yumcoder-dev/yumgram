// import React from 'react';
// import ReactDOM from 'react-dom';
// import { act } from 'react-dom/test-utils';
// import withState from '../withState';
// import pipe from '../pipe';
// import withHandlers from '../withHandlers';

// const useCount = pipe(
//   withState('count', 'setCount', 0),
//   withHandlers({
//     increment: ({ count, setCount }) => () => setCount(count + 1),
//     decrement: ({ count, setCount }) => () => setCount(count - 1),
//   }),
// );

// function Counter() {
//   const { count, increment } = useCount();

//   return (
//     <div>
//       <p>
//         You clicked
//         {' '}
//         {count}
//         {' '}
//         times
//       </p>
//       <button onClick={increment}>
//                 Click me
//       </button>
//     </div>
//   );
// }

// let container;

// beforeEach(() => {
//   container = document.createElement('div');
//   document.body.appendChild(container);
// });

// afterEach(() => {
//   document.body.removeChild(container);
//   container = null;
// });

// it('can render and update a counter', () => {
//   // Test first render and componentDidMount
//   act(() => {
//     ReactDOM.render(<Counter />, container);
//   });
//   const button = container.querySelector('button');
//   const label = container.querySelector('p');
//   expect(label.textContent).toBe('You clicked 0 times');
//   expect(document.title).toBe('You clicked 0 times');

//   // Test second render and componentDidUpdate
//   act(() => {
//     button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
//   });
//   expect(label.textContent).toBe('You clicked 1 times');
//   expect(document.title).toBe('You clicked 1 times');
// });

it('test lifecycle', () => {
  // let result = {};
  // expect(fetch('Get', 'https://my-json-server.typicode.com/typicode/demo/db')).resolves.toEqual(result);
});
