import { FC, useState } from "react";

// icon
import Icon from "react-icons-kit";
import { ic_content_copy } from "react-icons-kit/md/ic_content_copy";

interface Props {
  title: string;
  copyString: string | null;
}

const CopySnippet: FC<Props> = (props: Props) => {
  const { title, copyString = "null" } = props;

  const [copied, setCopied] = useState(false);

  const copyTextToClipboard = () => {
    navigator.clipboard
      .writeText(copyString as string)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      })
      .catch(() => {
        setCopied(false);
        console.error("Failed to copy text!");
      });
  };

  return (
    <div className="flex flex-col gap-5">
      <h4>{title}</h4>
      <div className="bg-gray-900 h-12 w-full rounded-md overflow-x-auto py-2 px-4 flex items-center relative">
        <p className="whitespace-nowrap">{copyString ? copyString : "null"}</p>
        <span
          className="absolute right-2 h-8 w-8 bg-slate-500 flex justify-center items-center hover:bg-slate-700 rounded-full"
          onClick={copyTextToClipboard}
        >
          <Icon icon={ic_content_copy} />
        </span>
      </div>
      {copied && <p>Copied to clipboard!</p>}
    </div>
  );
};

export default CopySnippet;
