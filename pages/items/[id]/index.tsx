import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import client from "@libs/server/client";

interface ProductWithUser extends Product {
  user: User;
}

export interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
  product,
  relatedProducts,
  isLiked,
}) => {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav, { data: favData }] = useMutation(
    `/api/products/${router.query.id}/fav`
  );
  const onFavClick = () => {
    if (!data) return;
    boundMutate({ ...data, isLiked: !data.isLiked }, false);
    //mutate("/api/users/me" , (prev:any) => ({ok:!prev.ok}) , false);
    toggleFav({});
  };
  console.log(favData);
  const [createChatroom, { data: chatroomData }] = useMutation(
    `/api/products/${router.query.id}/chatroom`
  );
  const clickChatroom = () => {
    createChatroom({});
  };
  return (
    <Layout seoTitle="Product" canGoBack>
      <div className="px-4 py-4">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {product?.user?.name}
              </p>
              <Link href={`/users/profiles/${product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-10">
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            {product.isReservation === true ? (
              <div className="flex justify-end -mt-8">
                <h1 className="text-red-500 font-semibold text-lg">예약중</h1>
              </div>
            ) : null}
            <span className="text-3xl mt-3 block text-gray-900">
              ${product?.price}
            </span>
            <p className="text-base my-6 text-gray-700">
              {product?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              <Link href={`/items/${router.query.id}/chatroom`}>
                <a onClick={clickChatroom} className="w-full">
                  <Button large text="Talk to seller" />
                </a>
              </Link>
              <button
                onClick={onFavClick}
                className={cls(
                  "p-3 flex items-center justify-center hover:bg-red-100  rounded-md",
                  isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-500 hover:text-gray-600"
                )}
              >
                {isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {relatedProducts.map((product, i) => (
              <Link key={product.id} href={`/items/${product.id}`}>
                <a key={product.id}>
                  <div className="h-56 w-full mb-4 bg-slate-300" />
                  <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    ${product.price}
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }
  const product = await client.product.findUnique({
    where: {
      id: +ctx?.params?.id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = false;
  /* 5초 delay 시켜주는 함수
await new Promise((resolve) => setTimeout(resolve , 5000)); */
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked,
    },
  };
};

export default ItemDetail;
