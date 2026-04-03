import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiChevronDown, FiChevronsRight, FiChevronUp, FiCrosshair, FiEdit3, FiSave, FiShare2, FiStopCircle, FiUpload, FiXCircle, FiXOctagon } from "react-icons/fi";
import Toast from "../../components/common/Toast";
import useToast from "../../hooks/useToast";
import { getSettings, updateSetting } from "../../services/systemSettingsService";

export default function SystemSettings() {
  const [data, setData] = useState([]);
  const [groupOpen, setGroupOpen] = useState({});
  const [editMode, setEditMode] = useState({});
  const [tempValues, setTempValues] = useState({});
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await getSettings();
      const settings = Array.isArray(res.data) ? res.data : [];
      setData(settings);

      // Default: all groups collapsed
      const groups = [...new Set(settings.map(s => s.setting_group))];
      const collapsed = {};
      groups.forEach(g => (collapsed[g] = false));
      setGroupOpen(collapsed);
    } catch {
      showToast("Failed to load", "error");
    }
  };

  const toggleGroup = (group) => {
    setGroupOpen(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const startEdit = (group) => {
    setEditMode(prev => ({ ...prev, [group]: true }));
    const initialValues = {};
    data.filter(s => s.setting_group === group).forEach(s => {
      initialValues[s.setting_key] = s.setting_value;
    });
    setTempValues(prev => ({ ...prev, ...initialValues }));
  };

  const cancelEdit = (group) => {
    setEditMode(prev => ({ ...prev, [group]: false }));
    // reset temp values
    const reset = {};
    data.filter(s => s.setting_group === group).forEach(s => {
      reset[s.setting_key] = s.setting_value;
    });
    setTempValues(prev => ({ ...prev, ...reset }));
  };

  const saveGroup = async (group) => {
    const groupSettings = data.filter(s => s.setting_group === group);
    try {
      for (let s of groupSettings) {
        const newValue = tempValues[s.setting_key];
        if (newValue !== s.setting_value) {
          await updateSetting({ setting_key: s.setting_key, setting_value: newValue });
        }
      }
      showToast("Updated successfully", "success");
      fetchData();
      setEditMode(prev => ({ ...prev, [group]: false }));
    } catch {
      showToast("Update failed", "error");
    }
  };

  const handleTempChange = (key, value) => {
    setTempValues(prev => ({ ...prev, [key]: value }));
  };

  const sliderOptions = ["Off", "Daily", "Weekly", "Monthly", "Yearly"];

  const renderInput = (s) => {
    const key = s.setting_key;
    const value = tempValues[key];

    if (["Yes","No"].includes(s.setting_value)) {
      return (
        <div className="flex items-center gap-3">
          <span className="text-sm">{value}</span>
          <button
            disabled={!editMode[s.setting_group]}
            onClick={() => handleTempChange(key, value === "Yes" ? "No" : "Yes")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition 
              ${value === "Yes" ? "bg-green-500" : "bg-gray-300"}`}
          >
            <div className={`bg-white w-4 h-4 rounded-full shadow transform transition 
              ${value === "Yes" ? "translate-x-6" : ""}`} />
          </button>
        </div>
      );
    }

    if (sliderOptions.includes(s.setting_value)) {
      const index = sliderOptions.indexOf(value);
      return (
        <div className="w-full">
          <input
            type="range"
            min="0" max={sliderOptions.length-1}
            value={index}
            disabled={!editMode[s.setting_group]}
            onChange={(e) => handleTempChange(key, sliderOptions[e.target.value])}
            className="w-full accent-blue-500"
          />
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            {sliderOptions.map(opt => (<span key={opt}>{opt}</span>))}
          </div>
          <div className="text-sm mt-1 font-semibold text-blue-600">Selected: {value}</div>
        </div>
      );
    }

    if (key.toLowerCase().includes("admin") || key.toLowerCase().includes("email")) {
      return (
        <input
          type="email"
          value={value}
          disabled={!editMode[s.setting_group]}
          onChange={(e) => handleTempChange(key, e.target.value)}
          className="border px-3 py-2 rounded w-full focus:ring focus:ring-blue-200"
        />
      );
    }

    if (key.toLowerCase().includes("number")) {
      return (
        <input
          type="number"
          value={value}
          disabled={!editMode[s.setting_group]}
          onChange={(e) => handleTempChange(key, e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-32"
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        disabled={!editMode[s.setting_group]}
        onChange={(e) => handleTempChange(key, e.target.value)}
        className="border px-3 py-2 rounded w-full focus:ring focus:ring-blue-200"
      />
    );
  };

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
        <div key={group} className="mb-6 border rounded-lg shadow-sm overflow-hidden">

          {/* group header */}
          <div
            className="flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-blue-100 cursor-pointer select-none"
            onClick={() => toggleGroup(group)}
          >
            <h3 className="font-semibold text-md">{group}</h3>
            {groupOpen[group] ? <FiChevronUp /> : <FiChevronDown />}
          </div>

          {groupOpen[group] && (
            <div className="bg-white p-4 space-y-4">

              {grouped[group].map(s => (
                <div key={s.setting_id} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">{s.setting_key}</label>
                  {renderInput(s)}
                </div>
              ))}

              {/* group action buttons */}
              <div className="flex gap-2 mt-2 text-lg">
                {!editMode[group] ? (
                  <div
                    onClick={() => startEdit(group)}
                    title="Edit"
                    className="text-blue-600 p-2 rounded-full hover:bg-blue-200 cursor-pointer"
                  >
                    <FiEdit3/>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => saveGroup(group)}
                      title="Save"
                      className=" text-green-600 p-2 rounded-full hover:bg-green-200 cursor-pointer"
                    >
                      <FiCheckCircle/>
                    </div>
                    <div
                      onClick={() => cancelEdit(group)}
                      title="Cancel"
                      className="text-red-600 p-2 rounded-full hover:bg-red-200 cursor-pointer"
                    >
                      <FiXOctagon/>
                    </div>
                  </>
                )}
              </div>

            </div>
          )}

        </div>
      ))}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  );
}