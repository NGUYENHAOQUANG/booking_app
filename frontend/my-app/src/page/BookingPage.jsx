import { useParams } from "react-router-dom";

const BookingPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Booking Page</h1>
      <p>Đặt phòng ID: {id}</p>
    </div>
  );
};

export default BookingPage;
