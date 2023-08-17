import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import InputForm from "../../components/FormSubmittion/InputForm";
import { getAppProps } from "../../utils/getAppProps";
import { useRouter } from "next/router";
import { resolve } from "styled-jsx/css";

export default function NewPost() {
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [topic, setTopics] = useState("");
  const [error, setError] = useState(false);

  const router = useRouter();

  const generatePostHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      
      //.. query Open AI API
      const response = await fetch("/api/generatePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, keywords }),
      });

      if(!response.ok){
        setLoading(false);
      }

      const json = await response.json();
      router.push(`/post/${json.postId}`);
    } catch (e) {
      setLoading(false);
      setError(true);
      console.log("error occured", e);
    
    }
  };

  return (
    <>
      <InputForm
        generatePostHandler={generatePostHandler}
        setTopics={setTopics}
        setKeywords={setKeywords}
        keywords={keywords}
        topic={topic}
        loadingState={loading}
        errorState={error}
      />
    </>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    if(!props.availableTokens){
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false
        }
      }
    }
    return {
      props,
    };
  },
});
