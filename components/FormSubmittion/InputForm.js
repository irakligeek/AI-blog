import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export default function InputForm({
  generatePostHandler,
  setTopics,
  setKeywords,
  keywords,
  topic,
  loadingState,
  errorState,
}) {
  return (
    <div>
      {loadingState && (
        <div className=" text-green-500 flex h-full w-full animate-pulse flex-col items-center justify-center">
          <FontAwesomeIcon icon={faGear} spin className="text-9xl" />
          <h5>Generating ...</h5>
        </div>
      )}
      {!loadingState && (
        <div className=" p-6 m-auto border rounded-lg mt-10 bg-[#f4f4f4] w-full  max-w-2xl">
          <form onSubmit={generatePostHandler}>
            <div>
              <label htmlFor="topics" className=" font-bold">
                Choose topics for your blog
              </label>
              <textarea
                name="topics"
                id="topics"
                value={topic}
                onChange={(e) => setTopics(e.target.value)}
                maxLength={80}
                className=" resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
              />
            </div>
            <div>
              <label htmlFor="keywords" className="font-bold">
                Add targeted keywords for your blog:
              </label>
              <textarea
                name="keywords"
                id="keywords"
                onChange={(e) => setKeywords(e.target.value)}
                value={keywords}
                maxLength={80}
                className=" resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
              />
              <small className="mb-2 block">Seperate keywords with comma</small>
            </div>
            <button
              className="btn !max-w-none disabled:cursor-not-allowed disabled:bg-gray-300"
              disabled={!topic.trim() || !keywords.trim()}
            >
              <FontAwesomeIcon icon={faGear} className=" mr-4" />
              Generate Post
            </button>
          </form>
          {errorState && (
            <p className=" text-[#ff0060] max-w-2xl m-auto my-2">
              Error occured, please try again later
            </p>
          )}
        </div>
      )}
    </div>
  );
}
