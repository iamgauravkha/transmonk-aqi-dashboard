import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const Settings = ({ setModal }) => {
  const [autoValue, setautoValue] = useState(0);
  const [controlByValue, setControlByValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      minVoltFan: 0,
      maxVoltFan: 0,
      minTemp: 0,
      maxTemp: 0,
      minVoltDamper: 0,
      maxVoltDamper: 0,
      minCO2: 0,
      maxCO2: 0,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const loadingCtn = toast.loading("Loading");
    const formattedData = {
      auto: Number(autoValue),
      minVoltFan: Number(data.minVoltFan),
      maxVoltFan: Number(data.maxVoltFan),
      minTemp: Number(data.minTemp),
      maxTemp: Number(data.maxTemp),
      minVoltDamper: Number(data.minVoltDamper),
      maxVoltDamper: Number(data.maxVoltDamper),
      minCO2: Number(data.minCO2),
      maxCO2: Number(data.maxCO2),
      controlBy: Number(controlByValue),
    };
    console.log("Formatted Data:", formattedData);
    const deviceId = localStorage.getItem("id");
    try {
      const response = await fetch(
        `http://localhost:4500/api/v1/update-settings/${deviceId}`,
        {
          method: "POST", // Specify the HTTP method
          headers: {
            "Content-Type": "application/json", // Set the content type if sending JSON
          },
          body: JSON.stringify(formattedData), // Convert data to JSON string
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.dismiss(loadingCtn);
        toast.error("Error! Try again");
        throw new Error("Something went wrong");
      } else {
        toast.dismiss(loadingCtn);
        toast.success("Settings Updated Successfully");
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoValue = () => {
    setautoValue(!autoValue);
  };

  const handleControlByValue = () => {
    setControlByValue(!controlByValue);
  };

  return (
    // <div className="w-full bg-white shadow-2xl rounded-xl">
    <div className="max-w-[1440px] mx-auto  flex flex-col gap-5 relative min-h-screen p-5 sm:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-sb text-gray-700 ">AHU Settings</h1>
        <IoClose
          className=" text-4xl cursor-pointer"
          onClick={() => setModal((prev) => !prev)}
        />
      </div>

      <div className=" bg-white rounded-md">
        <div className="w-full flex justify-between p-5 flex-wrap gap-5">
          <div className="flex flex-col gap-2">
            <h2>Change Mode</h2>
            <div className="flex items-center gap-5">
              <span>Manual</span>
              <div
                className={`w-[60px] bg-gray-200 h-[30px] rounded-full transition-all duration-200 ease-in flex items-center ${
                  !autoValue ? "justify-start" : "justify-end"
                } p-1`}
              >
                <div
                  className={`h-[25px] w-[25px] rounded-full ${
                    !autoValue ? "bg-red-500" : "bg-green-500"
                  } cursor-pointer `}
                  onClick={handleAutoValue}
                ></div>
              </div>
              <span>Auto</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2>Control Fan By</h2>
            <div className="flex items-center gap-5">
              <span>Temperature</span>
              <div
                className={`w-[60px] bg-gray-200 h-[30px] rounded-full transition-all duration-200 ease-in flex items-center ${
                  !controlByValue ? "justify-start" : "justify-end"
                } p-1`}
              >
                <div
                  className={`h-[25px] w-[25px] rounded-full ${
                    !controlByValue ? "bg-red-500" : "bg-green-500"
                  } cursor-pointer `}
                  onClick={handleControlByValue}
                ></div>
              </div>
              <span>
                CO<sub>2</sub>
              </span>
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-5"
        >
          <div>
            <label className="block text-sm font-medium">
              Minimum Fan Voltage
            </label>
            <input
              type="text"
              {...register("minVoltFan")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-[40px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Maximum Fan Voltage
            </label>
            <input
              type="text"
              {...register("maxVoltFan")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-[40px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Minimum Temperature
            </label>
            <input
              type="text"
              {...register("minTemp")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-[40px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Maximum Temperature
            </label>
            <input
              type="text"
              {...register("maxTemp")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-[40px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Minimum Damper Voltage
            </label>
            <input
              type="text"
              {...register("minVoltDamper")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-[40px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Maximum Damper Voltage
            </label>
            <input
              type="text"
              {...register("maxVoltDamper")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-[40px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Minimum CO<sub>2</sub> Level
            </label>
            <input
              type="text"
              {...register("minCO2")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-[40px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Maximum CO<sub>2</sub> Level
            </label>
            <input
              type="text"
              {...register("maxCO2")}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-[40px]"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 h-[40px] cursor-pointer self-end ${
              loading && "opacity-50"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
    // </div>
  );
};

export default Settings;
