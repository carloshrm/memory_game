import "../styles/Card.css";

function Card({ name, image, id, clickHandler }) {
  return (
    <div onClick={() => clickHandler(id)} className="ind_card">
      <img src={image} alt="" />
      <p>{name}</p>
    </div>
  );
}

export default Card;
