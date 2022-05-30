import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { useRouter } from "next/router";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { Chatroom } from "@prisma/client";
import { ItemDetailResponse } from ".";
import Link from "next/link";

interface ChatForm {
  chat: string;
}
interface ChatroomWithUser extends Chatroom {
  buyer: {
    avatar?: string;
    name: string;
  };
  seller: {
    avatar?: string;
    name: string;
  };
  chat: [{ id: number; chat: string; user: { id: number; avatar?: string } }];
}
interface ChatResponse {
  ok: boolean;
  chatroom: ChatroomWithUser;
}
const Chatrooms: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data: productData } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const { data, mutate } = useSWR<ChatResponse>(
    router.query.id ? `/api/products/${router.query.id}/chatroom` : null
    /* {
      refreshInterval: 1000,
    } */
  );
  const [sendChat] = useMutation(`/api/products/${router.query.id}/chat`);
  console.log(data);
  const { register, handleSubmit, reset } = useForm<ChatForm>();
  const onValid = (form: ChatForm) => {
    reset();
    sendChat(form);
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          chatroom: {
            ...prev.chatroom,
            chat: [
              ...prev.chatroom.chat,
              { id: Date.now(), chat: form.chat, user: { ...user } },
            ],
          },
        } as any),
      false
    );
  };
  return (
    <Layout canGoBack title={data?.chatroom?.seller?.name}>
      <div className="fixed flex w-[576px] h-24 bg-gray-100">
        <div className="w-12 h-12 m-2 bg-gray-500 rounded-sm" />
        <div className="flex flex-col">
          <span className="pt-2.5 text-sm">{productData?.product.name}</span>
          <span className="pt-1 text-gray-500 text-sm">
            ${productData?.product.price}
          </span>
          <Link href={`/items/${router.query.id}/reservation`}>
            <a className="w-24 h-6 border-2 flex justify-center items-center border-gray-500 hover:border-gray-800 transition-all rounded-sm text-xs mt-2.5 focus:bg-orange-500 focus:border-none focus:text-white">
              예약하기
            </a>
          </Link>
        </div>
      </div>
      <div className="py-10 px-4 space-y-4 overflow-y-scroll mt-16 mb-10">
        {data?.chatroom?.chat?.map((chat) => (
          <Message
            key={chat.id}
            message={chat.chat}
            reversed={chat.user.id === user?.id ? true : false}
          />
        ))}
      </div>
      <form
        onSubmit={handleSubmit(onValid)}
        className="fixed py-2 bg-white  bottom-0 inset-x-0"
      >
        <div className="flex relative max-w-md items-center  w-full mx-auto">
          <input
            {...register("chat", { required: true })}
            type="text"
            className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
          />
          <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
            <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
              &rarr;
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Chatrooms;
