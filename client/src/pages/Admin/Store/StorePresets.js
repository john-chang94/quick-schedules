import React, { useState } from "react";
import { isAuthenticated } from "../../../services/auth";
import { deletePreset, getPresets } from "../../../services/presets";

import { Spinner } from "../../../components/Spinner";

export const StorePresets = ({ presets, setPresets }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const handleDeletePreset = async (p_id) => {
    const doDelete = window.confirm("Delete preset?");
    if (doDelete) {
      setIsUpdating(true);
      setUpdatingId(p_id);

      const tokenConfig = isAuthenticated();
      await deletePreset(p_id, tokenConfig);
      const presets = await getPresets();

      setPresets(presets);
      setIsUpdating(false);
      setUpdatingId("");
    }
  };

  return (
    <>
      <h3 className="my-2">Manage presets</h3>
      {presets &&
        presets.map((preset, i) =>
          isUpdating && updatingId === preset.p_id ? (
            <Spinner height={20} marginTop={0} />
          ) : (
            <div key={i}>
              <div className="border-solid-1 p-1 flex justify-between">
                <p>
                  {preset.shift_start} - {preset.shift_end}
                </p>
                <p
                  className="pointer light-blue-darken-4"
                  onClick={() => handleDeletePreset(preset.p_id)}
                >
                  <i className="fas fa-trash-alt" />
                </p>
              </div>
            </div>
          )
        )}
    </>
  );
};
