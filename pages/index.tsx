import { useEffect, useState } from "react";
import { createPruEntry, usePruEntries } from "../graphql/api";
import Head from "next/head";

function getEntries(data) {
  return data ? data.entries.data.reverse() : [];
}

export default function Home() {
  const { data, errorMessage } = usePruEntries();
  const [entries, setEntries] = useState([]);
  const [username, setUsername] = useState("");
  const [pru, setPru] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setEntries(getEntries(data));
  }, [data, entries.length]);

  function handleSubmit(event) {
    event.preventDefault();
    if (username.trim().length === 0) {
      alert("Please provide a Pruwesome name");
      return;
    }
    if (pru.trim().length === 0) {
      alert("How do you have no pru to say? You need to pru forever!");
      return;
    }
    setSubmitting(true);
    createPruEntry(username, pru)
      .then((data) => {
        console.log("After Submit data", data);
        entries.unshift(data.data.createPruwitterEntry);
        setUsername("");
        setPru("");
        setEntries(entries);
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(`boo :( ${error}`);
        alert("🤷‍♀️");
        setSubmitting(false);
      });
  }

  function handlePruChange(event) {
    setPru(event.target.value);
  }

  function handleUsername(event) {
    setUsername(event.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Pruwitter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center flex-1 w-full h-full">
        <header className="my-10">
          <h1 className="px-5 text-4xl">Pruwitter - Twitter for pigeons 🍞</h1>
        </header>
        <main className="flex flex-col w-full px-5 my-10 lg:w-1/2">
          <form
            action="/"
            spellCheck="false"
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <label className="block pb-5">
              <span className="text-gray-700">Your name</span>
              <input
                type="text"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder=""
                onChange={handleUsername}
                value={username}
              />
            </label>
            <label className="block pb-5">
              <span className="text-gray-700">Pruuu</span>
              <textarea
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={3}
                draggable="false"
                onChange={handlePruChange}
                value={pru}
              ></textarea>
            </label>
            <span className="inline-flex rounded-md shadow-sm">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
              >
                {submitting ? (
                  <svg
                    className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                Send your pru 🍿
              </button>
            </span>
          </form>
          <div className="flex flex-wrap mt-10 -mx-3 overflow-hidden xl:-mx-4">
            {errorMessage ? (
              <p>{errorMessage}</p>
            ) : !data ? (
              <p className="px-3">Loading entries...</p>
            ) : (
              entries.map((entry, index, allEntries) => {
                const date = new Date(entry._ts / 1000);
                return (
                  <div
                    key={entry._id}
                    className="w-full px-3 my-3 overflow-hidden sm:w-full md:w-full lg:w-full xl:my-4 xl:px-4 xl:w-full"
                  >
                    <p className="pb-5 text-gray-900 text-md">
                      {entry.username}
                    </p>
                    <p className="mb-3 text-lg text-gray-600">{entry.pru}</p>
                    <span className="text-xs text-left text-gray-900">
                      {date.toDateString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
