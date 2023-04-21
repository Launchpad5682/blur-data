import { Roboto } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ImageInput from "./components/image-input";

// utils
import { encode, decode, isBlurhashValid } from "blurhash";
import Header from "./components/header";
import CopySnippet from "./components/copy-snippet";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

const HomePage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [naturalDimesnsions, setNaturalDimesnsions] =
    useState<Dimensions | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 400,
    height: 300,
  });

  const [imageData, setImageData] = useState(null);
  const [encodedString, setEncodedString] = useState(null);

  const [dataURL, setDataURL] = useState(null);
  const [size, setSize] = useState(null);

  // image and canvas ref
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const outputRef = useRef(null);

  const handleImageChange = (event: InputEvent) => {
    const selectedFile = event.target?.files[0];
    // console.log(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    // console.log(url);
    setImage(url);
  };

  //   useEffect(() => {
  //     if (imgRef.current && canvasRef.current) {
  //       const img = imgRef.current;
  //       const canvas = canvasRef.current;
  //       const ctx = canvas.getContext("2d");

  //       img.onload = () => {
  //         console.log("Image dims", img.width, img.height);
  //         canvas.width = img.width;
  //         canvas.height = img.height;
  //         ctx.drawImage(img, 0, 0);
  //       };
  //     }
  //   }, [image]);

  useEffect(() => {
    if (imageData) {
      setEncodedString(
        encode(imageData.data, imageData.width, imageData.height, 4, 4)
      );
    }
  }, [imageData]);

  useEffect(() => {
    if (encodedString && isBlurhashValid(encodedString) && naturalDimesnsions) {
      // Decode the blurhash into pixels
      const ratio = naturalDimesnsions.width / naturalDimesnsions.height;
      const width = 32;
      const height = Math.ceil(width / ratio);
      // const height = 48;
      const pixels = decode(encodedString, width, height, 1);

      // Get the canvas context
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      // canvas.style.background = "white";
      const ctx = canvas.getContext("2d");

      // Create a new ImageData object with the decoded pixels
      const imageData = ctx?.createImageData(width, height);
      // console.log(pixels.length, width, height);
      imageData?.data.set(pixels);

      // Put the ImageData object onto the canvas at position (0, 0)
      ctx?.putImageData(imageData, 0, 0);
      const resultDataURL = canvas.toDataURL();
      setDataURL(resultDataURL);
      const content_without_mime = resultDataURL.split(",")[1];

      const size_in_bytes = window.atob(content_without_mime).length;
      setSize(size_in_bytes);
    }
  }, [dimensions, encodedString, naturalDimesnsions]);

  const onLoad = (img) => {
    // console.log("img loaded successfully", img.target);
    const { naturalHeight, naturalWidth } = img.target;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const ratio = naturalWidth / naturalHeight;
    // update dimensions using natural height and width
    canvas.width = 400;
    canvas.height = 400 / ratio;
    setDimensions({ width: 400, height: 400 / ratio });
    setNaturalDimesnsions({ width: naturalWidth, height: naturalHeight });
    ctx.drawImage(
      img.target,
      0,
      0,
      naturalWidth,
      naturalHeight,
      0,
      0,
      400,
      400 / ratio
    );
    setImageData(ctx.getImageData(0, 0, 400, 400 / ratio));
    // console.log(canvas.toDataURL());
  };

  return (
    <div
      className={`${roboto.className} flex flex-col w-full h-screen bg-gray-950`}
    >
      <Header />
      <div className="flex flex-col gap-10 px-10 py-5 h-full w-full overflow-y-auto">
        <ImageInput value={image} changeHandler={handleImageChange} />
        {image ? (
          <div className="grid grid-cols-2 gap-10">
            <div>
              <div className="text-2xl">Canvas</div>
              <div className="flex flex-wrap justify-between max-w-5xl">
                {image && (
                  <Image
                    src={image}
                    alt="Uploaded Image"
                    ref={imgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    onLoad={onLoad}
                  />
                )}
              </div>
            </div>
            <div>
              <div className="text-2xl">
                Output{" "}
                {size
                  ? `(${size > 1000 ? `${size / 1000} kB` : `${size}B`})`
                  : null}
              </div>
              <div
                style={{ height: dimensions.height, width: dimensions.width }}
              >
                {dataURL && (
                  <Image
                    src={dataURL}
                    width={dimensions.width}
                    height={dimensions.height}
                    alt={"blurred and compressed image"}
                  />
                )}
              </div>
            </div>
            <CopySnippet title="Blur Hash" copyString={encodedString} />
            <CopySnippet title="DataURL" copyString={dataURL} />
          </div>
        ) : null}
        {/* Output
        <div className="bg-gray-900">
          <canvas ref={outputRef} />
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
