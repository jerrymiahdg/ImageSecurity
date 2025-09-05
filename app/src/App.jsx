import { useState } from "react";
import RemoveMetaData from "./RemoveMetadata";
import AddNoise from "./AddNoise";
import InvertColors from "./InvertColors";

const App = () => {
  const [dropdownShowing, setDropdownShowing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [triggerProcess, setTriggerProcess] = useState(false);
  const [noiseTrigPro, setNoiseTrigPro] = useState(false);
  const [invertTrigger, setInvertTrigger] = useState(false);

  const toggleDropdown = () => {
    setDropdownShowing((state) => !state);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (event) => setImageUrl(event.target.result);
    reader.readAsDataURL(file);
  }; // i assume this is old

  async function downloadBlob(data, filename, type) {
    const blob = new Blob([data], { type: type });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Release the object URL to free up memory
  }

  async function downloadImageFromURL(imageUrl, filename) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    downloadBlob(blob, filename, blob.type);
  }

  const onDownload = () => {
    downloadImageFromURL(imageUrl, "downloaded_image.png");
  };

  const copyImageToClipboard = async (imageUrl, filename) => {
    const response = await fetch(imageUrl);
    console.log(response);
    const blob = await response.blob();
    console.log(blob);
    downloadBlob(blob, filename, blob.type);
    const clipboardItem = new ClipboardItem({ [blob.type]: blob });
    console.log(clipboardItem);
    // 3. Write the item to the clipboard
    await navigator.clipboard.write([clipboardItem]);
  };

  const onCopy = () => {
    copyImageToClipboard(imageUrl, "downloaded_image.png");
  };

  return (
    <div className=" text-black/55 bg-yellow-500/25 font-ls flex flex-col items-center w-lg w-full p-10 gap-10">
      <h1 className="text-5xl font-bold font-ss">ImageSecurity</h1>
      <div className="flex flex-col items-center w-md gap-5">
        <input
          className="p-10 w-full bg-white/20 rounded-md"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {imageUrl && (
          <div className="flex flex-col gap-3">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="mt-4 max-h-64 max-w-full rounded-md"
            />
            <div className="flex justify-between">
              <button
                className="bg-blue-500 text-white p-3 rounded-md"
                onClick={onDownload}
              >
                download
              </button>
              <button
                className="bg-blue-500 text-white p-3 rounded-md"
                onClick={onCopy}
              >
                copy to clipboard
              </button>
            </div>
          </div>
        )}

        <div className="flex w-full justify-between">
          <div className="flex flex-col w-full gap-2">
            <button
              className="rounded-md p-5 bg-white/50"
              onClick={toggleDropdown}
            >
              process image (options)
            </button>
            {dropdownShowing && (
              <div className="flex flex-col gap-2 p-2 bg-white/40 rounded-md transition-all">
                {imageFile && (
                  <>
                    <RemoveMetaData
                      imageFile={imageFile}
                      setImageUrl={setImageUrl}
                      trigger={triggerProcess}
                    />
                    <button
                      className="mt-4 p-3 rounded bg-blue-500 text-white"
                      onClick={() => setTriggerProcess((prev) => !prev)}
                    >
                      Untracability - Remove Metadata
                    </button>
                  </>
                )}
                {imageFile && (
                  <>
                    <AddNoise
                      imageFile={imageFile}
                      setImageUrl={setImageUrl}
                      trigger={noiseTrigPro}
                    />
                    <button
                      className="mt-4 p-3 rounded bg-blue-500 text-white"
                      onClick={() => setNoiseTrigPro((prev) => !prev)}
                    >
                      Anti Reverse Search - Add Noise
                    </button>
                  </>
                )}
                {imageFile && (
                  <>
                    <InvertColors
                      imageFile={imageFile}
                      setImageUrl={setImageUrl}
                      trigger={invertTrigger}
                    />
                    <button
                      className="mt-4 p-3 rounded bg-purple-500 text-white"
                      onClick={() => setInvertTrigger((prev) => !prev)}
                    >
                      Invert / Uninvert Colors
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
