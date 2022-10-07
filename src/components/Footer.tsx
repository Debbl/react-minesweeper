import { useLocalStorageState } from "ahooks";
import { useEffect } from "react";
import { AiFillGithub } from "react-icons/ai";
import { IoMdMoon } from "react-icons/io";
import { RiSunFill } from "react-icons/ri";

function Footer() {
  const [isDark, setIsDark] = useLocalStorageState("minesweeper-isDark", {
    defaultValue: false,
  });
  useEffect(() => {
    const htmlEl = document.getElementsByTagName("html")[0];
    if (isDark)
      htmlEl.classList.add("dark");

    else
      htmlEl.classList.remove("dark");
  }, [isDark]);
  return (
    <div className="flex justify-center gap-x-3 text-2xl">
      <div>
        <button onClick={() => setIsDark(!isDark)}>
          {isDark
            ? (
            <IoMdMoon className="hover:cursor-pointer" />
              )
            : (
            <RiSunFill />
              )}
        </button>
      </div>
      <div>
        <a
          href="https://github.com/Debbl/react-minesweeper"
          target="_blank"
          rel="noreferrer"
        >
          <AiFillGithub className="hover:cursor-pointer hover:text-green-400/50" />
        </a>
      </div>
    </div>
  );
}

export default Footer;
