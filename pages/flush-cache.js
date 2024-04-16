// pages/flush-cache.js
import Head from "next/head";
import { FlushCache } from "@/components/flush-cache";

const FlushCachePage = () => {
  return (
    <div>
      <Head>
        <title>Flush Cache</title>
        <meta name="description" content="Flush the cache of the job board" />
      </Head>
      <FlushCache />
    </div>
  );
};

export default FlushCachePage;