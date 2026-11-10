import "./AlimentCard.css";
import { Link } from "react-router-dom";

const AlimentCard = (props) => {

    return (
        <Card>
            <div>
                <h2>{props.nom}</h2>
                <p>Calories : {props.calories} </p>
                <p>Per : {props.per}</p>
                <p>Gras : {props.gras}</p>
                <p> Proteines : {props.proteines}</p>
                <p>Glucides : {props.glucides}</p>
                <p>Quantite : {props.quantite}</p>
            </div>
            <div>
                <Link to={`/edit/${props.id}`}>
                    <button>Modifier</button>
                </Link>
            </div>
        </Card >
    );
};

export default AlimentCard;