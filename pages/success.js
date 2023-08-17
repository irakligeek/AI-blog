import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout/AppLayout";
import { getAppProps } from "../utils/getAppProps";
import Link from "next/link";

export default function Success() {
  return (
    <div className="mt-8 m-auto block max-w-screen-md">
      <h1 className="text-center">Thank you for your purchase</h1>
      <p className="text-center">
        You can start using your tokens to generate posts
      </p>
      <Link className="btn mt-4" href={"/post/new"}>
        Generate Post
      </Link>
    </div>
  );
}

Success.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
