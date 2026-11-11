import createPortal from "react-dom";

const DeleteModal = () => {
  const content = (
    <div>
      <header>
        <h2>Suppression</h2>
      </header>
      <div>
        <p>Êtes-vous sûr.e de vouloir supprimer cet aliment ?</p>
      </div>
      <footer>
        <button>Confirmer</button>
        <button>Annuler</button>
      </footer>
    </div>
  );
  return createPortal(content.document.getElementById("dialog"));
};
export default DeleteModal;
