import type { NextPage } from "next";
import Layout from "@components/layout";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import { Stream } from "@prisma/client";
import useSWR from "swr";
import { useState } from "react";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const Streams: NextPage = () => {
  const [page, setPage] = useState(1);
  const { data, mutate } = useSWR<StreamsResponse>(`/api/streams?page=${page}`);
  const onChangePage = (number: number) => {
    setPage(number);
    mutate();
    console.log(number);
  };
  return (
    <Layout seoTitle="Stream" title="라이브" hasTabBar>
      <div className="py-10  space-y-4 divide-y-2">
        {data?.streams?.map((stream) => (
          <Link key={stream.id} href={`/streams/${stream.id}`}>
            <a className="pt-4 block  px-4">
              <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
              <h1 className="text-2xl mt-2 font-bold text-gray-900">
                {stream.name}
              </h1>
            </a>
          </Link>
        ))}
        {[1, 2, 3, 4, 5].map((number) => (
          <button
            className="relative left-1/4 inline-flex items-center justify-center m-3 w-8 h-8 rounded-md text-white bg-orange-500"
            onClick={() => onChangePage(number)}
            key={number}
          >
            {number}
          </button>
        ))}
        <FloatingButton href="/streams/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};
export default Streams;
