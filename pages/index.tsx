import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import Item from "@components/item";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import useSWR from "swr";
import { Product } from "@prisma/client";

export interface ProductWithCount extends Product {
  _count: {
    record: number;
  };
  record: [{ kind: string }];
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { data } = useSWR<ProductsResponse>("/api/products");
  const favNumber = data?.products
    .map((a) => a.record)
    .map((a) => a.find((kind) => kind.kind === "Fav"));
  const arrayCount = (array: any) => {
    let counter = 0;
    let numArr = [];
    if (array)
      for (let i = 0; i < array.length; i++) {
        if (array[i] !== undefined) {
          counter++;
          numArr[i] = counter;
        } else if (array[i] === undefined) {
          numArr[i] = 0;
        }
        counter = 0;
      }
    return numArr;
  };
  const heartNumArr = arrayCount(favNumber);
  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex px-4 flex-col space-y-5 divide-y">
        {data?.products?.map((product, index) => (
          <Item
            key={product.id}
            id={product.id}
            title={product.name}
            price={product.price}
            hearts={heartNumArr[index]}
          />
        ))}
        <FloatingButton href="/items/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Home;
