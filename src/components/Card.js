function Card({ name, image, id, clickHandler }) {
  return (
    <div onClick={() => clickHandler(id)} className={"card"}>
      <img src={image} alt="" />
      <p>{name}</p>
    </div>
  );
}

export default Card;
