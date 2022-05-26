import React from "react";
import Modal from "react-modal";
import { useAuth } from "../../context";
import "./Login.scss";
const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(1, 1, 1, 0.75)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",

    width: "25%",
    boxShadow: "0 0 1em rgba(0,0,0,.3)",
  },
};
export const LoginModal = ({ isModalOpen, closeModal }) => {
  const { user, logIn, loginCred, setLoginCred } = useAuth();
  return (
    <Modal
      id="modal-login"
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      style={customStyles}
      contentLabel="Signup"
    >
      <form
        id="login"
        onSubmit={async (e) => {
          e.preventDefault();
          await logIn();
          closeModal();
        }}
      >
        <input
          type="email"
          value={loginCred.email}
          onChange={(e) => {
            setLoginCred({ ...loginCred, email: e.target.value });
          }}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={loginCred.password}
          onChange={(e) => {
            setLoginCred({ ...loginCred, password: e.target.value });
          }}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={user.loading}>
          {!user.loading ? "Login" : "Logging in...."}
        </button>
      </form>
    </Modal>
  );
};
