import type { ChangeEvent } from "react";
import { useState } from "react";

function SubmitForm({
  submit,
}: {
  submit: (username: string | undefined) => void;
}) {
  const [username, setUsername] = useState<string>();
  const submitClick = () => {
    submit(username);
  };
  return (
    <div className="fixed inset-0 m-auto flex h-44 w-80 flex-col items-center justify-evenly rounded-lg border bg-black/50">
      <div className="text-2xl font-bold text-teal-700">提交排行</div>
      <input
        type=""
        placeholder="你的名字"
        className="w-44 rounded-md p-1"
        value={username}
        onInput={(e: ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
        }
      />
      <button className="btn" onClick={submitClick}>
        提交
      </button>
    </div>
  );
}
export default SubmitForm;
