import React, { useEffect, useState } from "react";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import { getSettings, updateSetting } from "../../services/systemSettingsService";

export default function SystemSettings() {

  const [data, setData] = useState([]);
  const { toast, showToast, hideToast } = useToast();

  const fetchData = async () => {
    try {
      const res = await getSettings();
      setData(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast("Failed to load", "error");
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 🎯 update
  const handleChange = async (key, value) => {
    try {
      await updateSetting({ setting_key: key, setting_value: value });

      setData(prev =>
        prev.map(s =>
          s.setting_key === key ? { ...s, setting_value: value } : s
        )
      );

      showToast("Updated", "success");
    } catch {
      showToast("Update failed", "error");
    }
  };

  // 🎚️ slider options
  const sliderOptions = ["Off", "Daily", "Weekly", "Monthly", "Yearly"];

  // 🎯 render input
  const renderInput = (s) => {
    const key = s.setting_key;
    const value = s.setting_value;

    // ✅ Toggle YES/NO
    if (["Yes", "No"].includes(value)) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-sm">{value}</span>

          <button
            onClick={() => handleChange(key, value === "Yes" ? "No" : "Yes")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition 
              ${value === "Yes" ? "bg-green-500" : "bg-gray-300"}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow transform transition 
              ${value === "Yes" ? "translate-x-6" : ""}`} />
          </button>
        </div>
      );
    }

    // ✅ Slider (Backup / Export)
    if (sliderOptions.includes(value)) {

      const index = sliderOptions.indexOf(value);

      return (
        <div className="w-full">
          <input
            type="range"
            min="0"
            max={sliderOptions.length - 1}
            value={index}
            onChange={(e) => {
              const newValue = sliderOptions[e.target.value];
              handleChange(key, newValue);
            }}
            className="w-full accent-blue-500"
          />

          {/* labels */}
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            {sliderOptions.map(opt => (
              <span key={opt}>{opt}</span>
            ))}
          </div>

          <div className="text-sm mt-1 font-semibold text-blue-600">
            Selected: {value}
          </div>
        </div>
      );
    }

    // ✅ Email
    if (key.toLowerCase().includes("admin")) {
      return (
        <input
          type="email"
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="border px-3 py-2 rounded w-full focus:ring focus:ring-blue-200"
        />
      );
    }

    // ✅ Default
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(key, e.target.value)}
        className="border px-3 py-2 rounded w-full focus:ring focus:ring-blue-200"
      />
    );
  };

  // 🎯 group
  const grouped = data.reduce((acc, item) => {
    const g = item.setting_group || "General";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">System Settings</h2>

      {Object.keys(grouped).map(group => (
        <div key={group} className="mb-6">

          <h3 className="text-lg font-semibold mb-2">{group}</h3>

          <div className="bg-white shadow rounded-xl p-4 space-y-4">

            {grouped[group].map(s => (
              <div key={s.setting_id} className="flex flex-col gap-2">

                {/* label */}
                <label className="text-sm font-medium text-gray-700">
                  {s.setting_key}
                </label>

                {/* input */}
                {renderInput(s)}

              </div>
            ))}

          </div>

        </div>
      ))}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}