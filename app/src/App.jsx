import { useState } from "react";
import RemoveMetaData from "./RemoveMetadata";

const App = () => {
  const [dropdownShowing, setDropdownShowing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [triggerProcess, setTriggerProcess] = useState(false);
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
          <img
            src={imageUrl}
            alt="Uploaded"
            className="mt-4 max-w-full max-h-64 rounded-md"
          />
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
                      Remove Metadata
                    </button>
                  </>
                )}

                <button className="rounded-md p-3 bg-white/50">
                  add noise
                </button>
                <button className="rounded-md p-3 bg-white/50">
                  add noise
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
