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
    if (!entries.length) {
      setEntries(getEntries(data));
    }
  }, [data, entries.length]);

  function handleSubmit(event) {
    event.preventDefault();
    if (username.trim().length === 0) {
      alert("Please provide a Pruwesome name");
      return;
    }
    if (pru.trim().length === 0) {
      alert("How no? You need to pru forever!");
      return;
    }
    setSubmitting(true);
    createPruEntry(username, pru)
      .then((data) => {
        entries.unshift(data.data.createGuestbookEntry);
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
          <form action="/" spellCheck="false" autoComplete="off" onSubmit={handleSubmit}>
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
            <button className="p-2 mt-5 text-white bg-blue-600 rounded-md" type="submit">
              Send your pru 🍿
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
