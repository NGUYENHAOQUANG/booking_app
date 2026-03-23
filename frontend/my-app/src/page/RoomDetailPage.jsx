import { useParams } from "react-router-dom";

const RoomDetailPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Room Detail Page</h1>
      <p>Chi tiết phòng ID: {id}</p>
    </div>
  );
};

export default RoomDetailPage;
