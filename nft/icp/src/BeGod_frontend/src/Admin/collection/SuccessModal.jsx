import React from "react";

const SuccessModal = () => {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.closeButton}>✖</div>
        <div style={styles.content}>
          <div style={styles.icon}>
            <span style={styles.checkmark}>✔</span>
          </div>
          <div style={styles.message}>NEW COLLECTION CREATED SUCCESSFULLY</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#2C2C2C", // Dark background for the modal
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    color: "#FFF",
    fontSize: "16px",
  },
  content: {
    marginTop: "20px",
  },
  icon: {
    backgroundColor: "#28A745", // Green background for checkmark icon
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: "40px",
    color: "#FFF",
  },
  message: {
    marginTop: "20px",
    color: "#FFF",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default SuccessModal;
