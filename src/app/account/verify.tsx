import { useState } from "react";
import { api } from "~/trpc/react";
import VerificationInput from "./verificationInput/verificationInput";
import Button from "../_components/button";

export default function Verify({
  email,
  setEmail,
  setForm,
}: {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setForm: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [verification_code, setCode] = useState<string[]>(
    new Array(8).fill(""),
  );
  const [error, setError] = useState("");
  const verifyMutation = api.user.verify.useMutation();
  const sendMailMutation = api.user.sendMail.useMutation();
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [mailLoading, setMailLoading] = useState(false);
  const sendCodeReq = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMailLoading(true);
    if (email !== "") {
      sendMailMutation.mutate(
        { email: email },
        {
          onError: () => {
            setMailLoading(false);
          },
          onSuccess: (data) => {
            setMailLoading(false);
            localStorage.setItem("hash", data.verification_code);
          },
        },
      );
    } else {
      setError("Please enter valid email");
    }
  };
  const verifyCode = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVerifyLoading(true);
    const code = verification_code.join("");
    const hash = localStorage.getItem("hash");
    if (hash) {
      verifyMutation.mutate(
        {
          verification_code: code,
          email,
          hash: localStorage.getItem("hash") ?? "",
        },
        {
          onError: () => {
            setVerifyLoading(false);
          },
          onSuccess: () => {
            setVerifyLoading(false);
            setForm(2);
            localStorage.removeItem("hash");
          },
        },
      );
    } else {
      setError("Code not found please request again!");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center p-10">
        <div className="w-96 rounded-xl border border-solid border-gray-400 p-6">
          <h1 className="w-100 text-center text-3xl font-bold">
            Verify your email
          </h1>
          <form onSubmit={sendCodeReq} className="flex flex-col">
            {sendMailMutation.error ? (
              <p className="text-red-500">{sendMailMutation.error.message}</p>
            ) : (
              <p className="text-red-500">{error}</p>
            )}
            {verifyMutation.error ? (
              <p className="text-red-500">{verifyMutation.error.message}</p>
            ) : null}
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@123.any"
              className="rounded-md border border-solid border-gray-400 p-2"
              required
            />{" "}
            <br />
            <Button value="SEND CODE" loading={mailLoading} />
          </form>
          <form onSubmit={verifyCode} className="flex flex-col pt-6">
            Code
            <VerificationInput values={verification_code} setValues={setCode} />
            <br />
            <Button value="VERIFY" loading={verifyLoading} />
          </form>
          <div className="w-100 pt-6 text-center">
            Doesn&apos;t receive code?{" "}
            <button className="font-bold" onClick={() => sendCodeReq}>
              Resend
            </button>
          </div>
          <div className="w-100 text-center">
            Have an Account?{" "}
            <button className="font-bold" onClick={() => setForm(2)}>
              LOGIN
            </button>
          </div>
          <div className="w-100 pb-2 text-center">
            Don&apos;t have an Account?{" "}
            <button className="font-bold" onClick={() => setForm(0)}>
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
