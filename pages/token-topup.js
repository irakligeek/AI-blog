import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopup() {
  
  const addTokenHandler = async (e) => {
    //.. fetch token data from out custom api endpoint
    const response = await fetch("/api/addTokens", {
      method: "POST"
    });

    const data = await response.json();
    //Navigate to Stripe checkout URL
    window.location.href = data.session.url;

  };

  return (
    <div className=" mt-8">
      <button className="btn" onClick={addTokenHandler}>
        Add Tokens
      </button>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props
    }
  }
});
