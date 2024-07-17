"use client";
import { api } from "~/trpc/react";
import "./style.css";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
export default function () {
  /*const res: any = api.category.getCategories.useQuery({
    page,
    token: token,
  });*/

  const [pages, setPages]: any = useState();
  const getCategories = api.category.getCategories.useMutation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { mutate, error } = api.category.checkCategory.useMutation();
  const [page, setPage] = useState(0);
  const [token, setToken] = useState("");
  const [categories, setCategories]: any = useState([]);
  const [checkedCategories, setCheckedCategories] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const fetchData = (page: number) => {
    const Token = localStorage?.getItem("token") || "";
    setToken(Token);
    getCategories.mutate(
      {
        token: Token,
        page,
        user_id: parseInt(localStorage?.getItem("user_id") || "") || -1,
      },
      {
        onSuccess: (data) => {
          if (data?.categories) {
            setCategories(data.categories);
            setPages(new Array(data?.pages).fill(""));
            setCheckedCategories(data.checkedCategories);
            setLoading(false);
          }
        },
        onError: (error) => {
          if (error.message === "login") {
            router.push("/account");
          }
        },
      },
    );
  };
  useEffect(() => {
    if (!localStorage?.getItem("token")) router.push("/account");
    else {
      if (categories.length === 0) {
        fetchData(0);
      }
    }
  }, [getCategories.data, getCategories.error]);

  const checkCategory = (id: string) => {
    setLoading(true);
    mutate(
      {
        token: token,
        category_id: parseInt(id),
        user_id: parseInt(localStorage.getItem("user_id") || "-1"),
        check: checkedCategories.has(id),
      },
      {
        onSuccess: (data) => {
          if (data?.checkedCategories) {
            setCheckedCategories(data?.checkedCategories);
            setLoading(false);
          }
        },
      },
    );
  };

  return (
    // <div></div>
    <>
      {token !== "" ? (
        <div className="flex items-center justify-center p-10">
          <div className="w-max rounded-xl border border-solid border-gray-300 p-9">
            <h1 className="w-100 pb-4 text-center text-3xl font-bold">
              Please mark your interests!
            </h1>
            <div className="text-center">We will keep you notified.</div>
            <div className="w-100 mb-3 pt-5 text-xl font-bold">
              My saved interests!
            </div>

            {getCategories.data && !loading ? (
              categories.map((category: any, index: number) => {
                return (
                  <div key={index}>
                    <div className="custom-checkbox my-4" key={index}>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          className="form-checkbox text-black"
                          onChange={(e) => {
                            checkCategory(category.id);
                          }}
                          checked={
                            checkedCategories.has(category.id) ? true : false
                          }
                        />
                        <span>{category.name}</span>
                      </label>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center">
                <div className="h-14 w-14 animate-spin rounded-full border-4 border-l-0 border-t-0 border-solid border-black"></div>
              </div>
            )}
            {getCategories.data ? (
              <div>
                {page !== 0 ? (
                  <>
                    <button
                      className="px-1 text-gray-500"
                      onClick={() => {
                        setPage(0);
                        fetchData(0);
                      }}
                    >
                      {"<<"}
                    </button>
                    <button
                      className="px-1 text-gray-500"
                      onClick={() => {
                        setPage(page - 1);
                        fetchData(page - 1);
                      }}
                    >
                      {"<"}
                    </button>
                  </>
                ) : (
                  ""
                )}
                {page >= 4 && "..."}
                {pages.map((_: any, index: number) => {
                  return (
                    <button
                      key={index}
                      className={`px-1 ${page === index ? "text-xl text-black" : "text-gray-500"} ${index > page + 3 || index < page - 3 ? "hidden" : "inline"}`}
                      onClick={() => {
                        setPage(index);
                        fetchData(index);
                      }}
                    >
                      {index + 1}
                    </button>
                  );
                })}
                {page <= pages.length - 5 && "..."}
                {page !== pages.length - 1 ? (
                  <>
                    <button
                      className="px-1 text-gray-500"
                      onClick={() => {
                        setPage(page + 1);
                        fetchData(page + 1);
                      }}
                    >
                      {">"}
                    </button>
                    <button
                      className="px-1 text-gray-500"
                      onClick={() => {
                        setPage(pages.length - 1);
                        fetchData(pages.length - 1);
                      }}
                    >
                      {">>"}
                    </button>
                  </>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-l-0 border-t-0 border-solid border-black"></div>
        </div>
      )}
    </>
  );
}
