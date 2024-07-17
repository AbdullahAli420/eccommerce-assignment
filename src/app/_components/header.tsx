"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Header() {
  const router = useRouter();
  return (
    <header className="">
      <div className="flex justify-end">
        <Link className="mx-2 text-sm" href="/">
          Help
        </Link>
        <Link className="mx-2 text-sm" href="/">
          Orders & Returns
        </Link>
        <button
          className="mx-2 text-sm"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            router.push("/account");
          }}
        >
          Logout
        </button>
      </div>
      <div className="flex items-baseline justify-between">
        <h1 className="ml-4 text-3xl font-bold">ECCOMMERCE</h1>
        <div>
          <button className="mx-7 font-bold">Categories</button>
          <button className="mx-7 font-bold">Sale</button>
          <button className="mx-7 font-bold">Clearance</button>
          <button className="mx-7 font-bold">New Stock</button>
          <button className="mx-7 font-bold">Trending</button>
        </div>
        <div>
          <button className="m-2">
            <svg
              className="h-6 w-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
          <button className="m-2">
            <svg
              className="h-6 w-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex justify-center p-5 text-sm">
        <div>{"<"}</div>
        <div className="mx-4">Get 10% off on business sign up</div>
        <div>{">"}</div>
      </div>
    </header>
  );
}
