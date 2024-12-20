import { useEffect, useState } from "react";

const ImageCaurousal = ({
  images,
  baseUrl,
  count,
  onPress,
}: {
  images: string[];
  baseUrl: string;
  count: number;
  onPress: () => void;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [indicators, setIndicators] = useState<number[]>([]);

  const changeIndex = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    ev.preventDefault();

    setSelectedIndex(index);
  };

  useEffect(() => {
    getIndicators();
  }, [selectedIndex]);

  const getIndicators = () => {
    let pushIndex: number[] = [];
    if (selectedIndex < count - 2) {
      images.forEach((_, index) => {
        if (count <= 5 || (selectedIndex <= 2 && pushIndex.length < 5)) {
          pushIndex.push(index);
        } else if (count > 5 && selectedIndex > 2 && pushIndex.length < 5) {
          pushIndex.push(index + selectedIndex - 2);
        }
      });
      setIndicators(pushIndex);
    }
  };

  return (
    <div className="relative items-center justify-center flex">
      {selectedIndex !== 0 && (
        <button
          onClick={(ev) => changeIndex(ev, selectedIndex - 1)}
          className="absolute z-10 size-8 rounded-full left-3 bg-slate-400 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      )}
      <img
        className="rounded-2xl aspect-square object-cover cursor-pointer"
        src={`${baseUrl}${images[selectedIndex]}`}
        onClick={onPress}
      />
      {selectedIndex != count - 1 && (
        <button
          onClick={(ev) => changeIndex(ev, selectedIndex + 1)}
          className="absolute size-8 right-3 rounded-full bg-slate-400 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}
      <div className="absolute z-10 gap-2 transition-transform flex  bottom-4 items-center">
        {indicators.map((_) => (
          <div
            className={`size-2 transition-opacity rounded-full ${
              selectedIndex == _ ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCaurousal;
