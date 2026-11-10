import "./AlimentCard.css";
import { Link } from "react-router-dom";

const AlimentCard = (props) => {

    return (
        <Card >
            <div className="AlimentCard_content">
                <h2 className="title">{props.nom}</h2>
                <p>Calories : {props.calories} </p>
                <p>Per : {props.per}</p>
                <p>Gras : {props.gras}</p>
                <p> Proteines : {props.proteines}</p>
                <p>Glucides : {props.glucides}</p>
                <p>Quantite : {props.quantite}</p>
            </div>
            <div className="btn_actions">
                <Link to={`/edit/${props.id}`}>
                    <button className="btn_submit">Modifier</button>
                </Link>
            </div>
        </Card >
    );
};

export default AlimentCard;