import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}




const ExpensiveChild = React.memo(Child, (prevProps, nextProps) => prevProps.data.id === nextProps.data.id);

<ExpensiveChild data={{ id: 1 }} />

const Child = React.memo(function Child({ value }) {
  console.log("render Child");
  return <div>{value}</div>;
});