"use client";
import { useState } from "react";
// import { api } from "~/trpc/server"
import { api } from "~/trpc/react";
import Button from "../_components/button";

export default function Signup({
  email,
  setEmail,
  setForm,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setForm: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, error } = api.user.signup.useMutation();
  const [psType, setPsType] = useState("password");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const createAccount = async (e: React.ChangeEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (email !== "" && password !== "" && name !== "") {
      if (password.length >= 8)
        mutate(
          { name, email, password },
          {
            onError: () => {
              setLoading(false);
            },
            onSuccess: () => {
              setLoading(false);
              setForm(1);
            },
          },
        );
      else {
        setErrMsg("Password must be of length 8");
        setLoading(false);
      }
    } else {
      setErrMsg("Please fill all credentials:");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div className="w-96 rounded-xl border border-solid border-gray-400 p-6">
        <h1 className="w-100 text-center text-2xl font-bold">
          Create Your Account
        </h1>
        <form onSubmit={createAccount} className="flex flex-col">
          {error ? (
            <p className="text-red-500">{error.message}</p>
          ) : (
            <p className="text-red-500">{errMsg}</p>
          )}
          Name
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-100 rounded-md border border-solid border-gray-400 p-2"
          />
          <br />
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
          <Button value="CREATE ACCOUNT" loading={loading} />
        </form>
        <div className="w-100 pt-6 text-center">
          Have an Account?{" "}
          <button className="font-bold" onClick={() => setForm(2)}>
            LOGIN
          </button>
        </div>
        <div className="w-100 pb-6 text-center">
          Unverified Account?{" "}
          <button className="font-bold" onClick={() => setForm(1)}>
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );
}
