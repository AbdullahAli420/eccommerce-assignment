import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Button from "../_components/button";

export default function ({
  email,
  setEmail,
  setForm,
}: {
  email: any;
  setEmail: any;
  setForm: any;
}) {
  // const [email, setEmail] = useState('')
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { mutate, error, data } = api.user.login.useMutation();
  const [psType, setPsType] = useState("password");
  const [loading, setLoading] = useState(false);

  const Login = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    mutate(
      { email, password },
      {
        onError: (err) => setLoading(false),
        onSuccess: (data) => {
          localStorage.setItem("token", data?.token);
          localStorage.setItem("user_id", data?.userId.toString());
          router.push("/categories");
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div className="w-96 rounded-xl border border-solid border-gray-400 p-6">
        <h1 className="w-100 text-center text-3xl font-bold">Login</h1>
        <div className="w-100 text-center text-xl font-bold">
          Welcome back to ECCOMERCE
        </div>
        <div className="text-center">The next gen business marketplace</div>
        <form onSubmit={Login} className="flex flex-col">
          {error ? <p className="text-red-500">{error.message}</p> : null}
          Email
          <input
            type="email"
            name="email"
            placeholder="example@123.any"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-100 rounded-md border border-solid border-gray-400 p-2"
          />
          <br />
          Password
          <div className="flex justify-between rounded-md border border-solid border-gray-400 p-1">
            <input
              type={psType}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-100 p-2 focus-visible:outline-0"
            />
            <button
              className="pr-2 underline"
              onClick={(e) => {
                e.preventDefault();
                psType === "password"
                  ? setPsType("text")
                  : setPsType("password");
              }}
            >
              {psType === "password" ? <>show</> : <>hide</>}
            </button>
          </div>
          <br />
          <Button value="LOGIN" loading={loading} />
        </form>
        <div className="w-100 p-6 text-center">
          Don't have an Account?{" "}
          <button className="font-bold" onClick={() => setForm(0)}>
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}
