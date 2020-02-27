import { Button, Typography } from "@material-ui/core";
import { Machine } from "../../../business/objects/machine";
import React from "react";
interface AddMachineModalProps {
  // e: any,
  closeModal: any;
  station: any;
  machinesToModify: any;
  toggleMachine: any;
  handleSubmit: any;
  currentUserMachines: any;
}
const AddMachineModalView: React.SFC<AddMachineModalProps> = (
  props: AddMachineModalProps
) => {
  const {
    closeModal,
    station,
    machinesToModify,
    toggleMachine,
    handleSubmit,
    currentUserMachines
  } = props;
  return (
    <div className="group-machine-modal-container">
      <div className="group-machine-modal">
        <div className="group-machine-modal-title">
          <Typography variant="h2" gutterBottom={true}>
            Add Your Machines
          </Typography>
          <div onClick={closeModal} className="add-cursor">
            <i className="fal fa-times" />
          </div>
        </div>
        <div className="group-user-machine-container">
          {currentUserMachines.map((machine: Machine) => {
            let inStation = false;
            if (station.machines.indexOf(machine.mid) >= 0) {
              inStation = true;
            }
            if (machinesToModify[machine.mid]) {
              if (inStation === false) {
                inStation = true;
              } else {
                inStation = false;
              }
            }
            let memory: number = 0;
            let cores: number = 0;
            if (machine.memory !== "Unknown") {
              memory = +(+machine.memory / 1e9).toFixed(1);
            }
            if (machine.cpu !== "Unknown") {
              cores = +machine.cpu;
            }
            return (
              <div className="group-user-machine" key={machine.mid}>
                <div>
                  <div className="machine-name">{machine.machine_name}</div>
                  <div className="machine-details">
                    <span>
                      <i className="fas fa-sd-card" />
                      {memory}GB
                    </span>
                    <span>
                      <i className="fas fa-tachometer-fast" />
                      {cores} Cores
                    </span>
                  </div>
                </div>

                <div className="add-cursor">
                  <button
                    className={inStation ? "in-group" : "not-in-group"}
                    onClick={toggleMachine(machine)}
                  >
                    {inStation ? (
                      <i className="fas fa-check-circle" />
                    ) : (
                      <i className="far fa-check-circle" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="group-machine-modal-buttons">
          <Button variant="outlined" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AddMachineModalView;
