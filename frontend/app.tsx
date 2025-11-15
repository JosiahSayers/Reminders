import useAxios from "axios-hooks";

export default function App() {
  const [{ data: reminders, loading }] = useAxios("/api/reminders");

  return (
    <>
      <h1>Hello from a react app!</h1>
      {loading ? (
        <p>loading...</p>
      ) : (
        <pre>{reminders.length && JSON.stringify(reminders, null, 2)}</pre>
      )}
    </>
  );
}
