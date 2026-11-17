import createPortal from "react-dom";
import "./DeleteModal.css";

const DeleteModal = () => {
  const content = (
    <div className="Modal">
      <header>
        <h2>Suppression</h2>
      </header>
      <div className="body">
        <p>Êtes-vous sûr.e de vouloir supprimer cet aliment ?</p>
      </div>
      <footer>
        <button className="btn_confirm">Confirmer</button>
        <button className="btn_cancel">Annuler</button>
      </footer>
    </div>
  );
  return createPortal(content.document.getElementById("dialog"));
};
export default DeleteModal;
