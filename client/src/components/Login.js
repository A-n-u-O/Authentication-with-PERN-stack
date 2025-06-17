const Login = ({setAuth}) => {
  return (
    <>
      <h1>Login</h1>
      <button className=" alert-dark w-25" onClick={()=>setAuth(true)}>log in</button>
    </>
  );
};
export default Login;
