"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout";
import { PiPencilLineBold, PiTrashBold } from "react-icons/pi";
import { backendUrl } from "@/url";

const dropdownTypes = [
  "Religion",
  "Caste",
  "Sub Caste",
  "City",
  "Occupation",
  "Education",
];

const DropdownManager = () => {
  const [selectedType, setSelectedType] = useState("Religion");
  const [options, setOptions] = useState([]);
  const [newValue, setNewValue] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState("");

  const fetchOptions = async () => {
    const res = await fetch(
      `${backendUrl}/admin/get-dropdown-options/${selectedType}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.options) {
          setOptions(data.options);
        }
      });
  };

  const addOption = async () => {
    if (!newValue.trim()) return;
    const dataObj = {
      type: selectedType,
      value: newValue,
    };
    await fetch(`${backendUrl}/admin/add-dropdown-option`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObj),
      credentials: "include",
    });
    setNewValue("");
    fetchOptions();
  };

  const updateOption = async (id) => {
    if (!editValue.trim()) return;
    await fetch(`${backendUrl}/admin/update-dropdown-option/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: editValue,
      }),
      credentials: "include",
    });
    setEditMode(null);
    fetchOptions();
  };

  const deleteOption = async (id) => {
    await fetch(`${backendUrl}/admin/delete-dropdown-option/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    fetchOptions();
  };

  useEffect(() => {
    fetchOptions();
  }, [selectedType]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Dropdown Options</h1>

      <div className="mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 border outline-none rounded w-full sm:w-64"
        >
          {dropdownTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Add new ${selectedType}`}
          className="border p-2 rounded w-full outline-none"
        />
        <button
          className="w-[93px] h-[40px] bg-navBtnBg-Color rounded-[5px] text-[13px]  text-white ml-3"
          onClick={addOption}
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {options &&
          options.length > 0 &&
          options.map((opt) => (
            <li
              key={opt._id}
              className="flex items-center justify-between border p-2 rounded"
            >
              {editMode === opt._id ? (
                <>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border p-1 rounded w-full mr-2"
                  />
                  <button
                    onClick={() => updateOption(opt._id)}
                    className="text-green-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>{opt.value}</span>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setEditMode(opt._id);
                        setEditValue(opt.value);
                      }}
                      className="h-[40px] rounded-[5px] ml-3"
                    >
                      <PiPencilLineBold/>
                    </button>
                    <button
                      onClick={() => deleteOption(opt._id)}
                      className="text-red-600"
                    >
                      <PiTrashBold/>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

DropdownManager.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
export default DropdownManager;
