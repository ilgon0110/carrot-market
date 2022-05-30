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

interface FormReservation {
  date?: string;
  time?: string;
}

const Reservation: NextPage = () => {
  const router = useRouter();
  const { data } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [sendReservation, { data: Rdata }] = useMutation(
    `/api/products/${router.query.id}/reservation`
  );
  const [sendChat] = useMutation(`/api/products/${router.query.id}/chat`);
  const { register, handleSubmit } = useForm();
  const onValid = (form: FormReservation) => {
    console.log(form);
    sendReservation(form);
    let chat = `${form.date} ${form.time}에 예약하셨습니다.`;
    sendChat(chat ? { chat } : null);
    router.push(`/items/${router.query.id}/chatroom`);
  };
  const goBack = () => {
    router.back();
  };
  return (
    <Layout>
      <div>{data?.product.image}</div>
      <div>{data?.product.name}</div>
      <div>{data?.product.price}</div>
      <form onSubmit={handleSubmit(onValid)}>
        <input type="date" {...register("date", { required: true })}></input>
        <input type="time" {...register("time", { required: true })}></input>
        <span>위 날짜로 예약하시겠습니까?</span>
        <br />
        <button>예</button>
      </form>
      <button onClick={goBack}>아니오</button>
    </Layout>
  );
};

export default Reservation;
