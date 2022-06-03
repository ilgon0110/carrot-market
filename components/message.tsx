import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import { RKind } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
  reservation?: RKind;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
  reservation,
}: MessageProps) {
  const router = useRouter();
  const [sendTrue] = useMutation(
    `/api/products/${router.query.id ? router.query.id : null}`
  );
  const [sendFalse] = useMutation(
    `/api/products/${router.query.id ? router.query.id : null}`
  );
  const clickTrue = () => {
    sendTrue({ istrue: true });
    router.push(`/`);
  };
  const clickFalse = () => {
    sendTrue({ istrue: false });
    router.push(`/`);
  };
  return (
    <div
      className={cls(
        "flex items-start space-x-2",
        reversed ? "flex-row-reverse space-x-reverse" : "space-x-2"
      )}
    >
      <div className={"w-8 h-8 rounded-full bg-slate-400"} />
      <div
        className={cls(
          "w-1/2 text-sm text-gray-700 p-2 border border-gray-300 rounded-md",
          reservation === "Reservation" ? "h-16 text-xs text-center" : ""
        )}
      >
        <p>{message}</p>
        {reservation === "Reservation" ? (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={clickTrue}
              className="w-16 border-2 flex justify-center items-center border-gray-300 hover:border-gray-800 transition-all rounded-sm text-xs mt-1.5 focus:bg-orange-500 focus:border-transparent focus:text-white"
            >
              예
            </button>
            <button
              onClick={clickFalse}
              className="w-16 border-2 flex justify-center items-center border-gray-300 hover:border-gray-800 transition-all rounded-sm text-xs mt-1.5 focus:bg-orange-500 focus:border-transparent focus:text-white"
            >
              아니오
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
