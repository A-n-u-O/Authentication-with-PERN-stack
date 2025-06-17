const Login = ({setAuth}) => {
  return (
    <>
      <h1 className=" text-3xl font-bold">Login</h1>
      <button className="" onClick={()=>setAuth(true)}>log in</button>
    </>
  );
};
export default Login;
