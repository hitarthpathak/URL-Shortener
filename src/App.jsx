import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function App() {

  const [long_url, set_long_url] = useState("");
  const [short_url, set_short_url] = useState("");

  const shorten_url = async (long_url) => {
    try {
      const response = await axios.post("https://api.tinyurl.com/create",
        {
          url: long_url,
          domain: "tinyurl.com"
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TINY_URL_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        }
      );
      return response.data.data.tiny_url;
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: shorten_url,
    onSuccess: (data) => {
      set_short_url(data);
      set_long_url("");
    }
  });

  function submit_handle(e) {
    e.preventDefault();
    if (!long_url) {
      alert("Please Enter A URL!");
      return;
    }
    mutation.reset();
    mutation.mutate(long_url);
  };

  function copy_handle() {
    if (!short_url) return;
    navigator.clipboard.writeText(short_url);
    alert("Copied To Clipboard!");
  };

  return (

    <>

      <h1 className="text-3xl text-center font-bold p-5">URL Shortener</h1>

      <hr />

      <div className="url-box h-auto w-full p-4">

        <form className="url-box-form h-auto w-full flex items-center justify-center flex-col gap-4" onSubmit={submit_handle}>

          <input className="url-input border outline-none h-auto w-full p-2" type="url" placeholder="Enter URL" value={long_url} onChange={(e) => set_long_url(e.target.value)} />

          <button className="shorten-button h-auto w-auto bg-blue-500 text-white p-2" type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Shortening..." : "Shorten"}</button>

          {

            short_url

            &&

            <div className="output-box h-auto w-full flex items-center justify-center gap-4">

              <input className="url-input border outline-none h-auto w-full p-2" type="text" value={short_url} readOnly />

              <button className="copy-button h-auto w-auto bg-green-500 text-white p-2" type="button" onClick={copy_handle}>Copy</button>

            </div>

          }

          {

            mutation.isError

            &&

            <div className="error-box h-auto w-full flex items-center justify-center gap-4">

              <p className="error-message text-red-500">Failed To Shorten URL! Check Your API Token Or Internet Connection!!</p>

            </div>

          }

        </form>

      </div>

    </>

  );

};

export default App
