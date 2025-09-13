import { useCallback, useState, memo, createContext, useMemo, useContext } from "react";
const UserContext = createContext({});
const UserStateContext = createContext({});
const UserDispatchContext = createContext({});

const List = () => {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: "Alice" });
  
  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <button onClick={() => setUser({ name: "Bob" })}>Set User</button>
      <UserContext.Provider value={{ user, setUser }}>
        <UserStateContext.Provider value={user}>
          <UserDispatchContext.Provider value={setUser}>
            <MainPage />
          </UserDispatchContext.Provider>
        </UserStateContext.Provider>
      </UserContext.Provider>
    </div>
  );
};

export default List;

const MainPage = memo(() => {
  return (
    <>
      <Header />
      <Sidebar />
      <Content />
    </>
  );
});

const Header = memo(() => {
  console.log("Header rendered");
  const user = useContext(UserStateContext);
  return <div>Header {user?.name}</div>;
});

const Sidebar = memo(() => {
  console.log("Sidebar rendered");
  return <div>Sidebar</div>;
});

const Content = memo(() => {
  console.log("Content rendered");
  return <div>Content</div>;
});


