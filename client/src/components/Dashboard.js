const Dashboard = ({ setAuth }) => {
  return (
    <>
      <h1 className=" w-75">Dashboard</h1>
      <button className=" alert-dark w-25" onClick={() => setAuth(false)}>
        log out
      </button>
    </>
  );
};
export default Dashboard;
