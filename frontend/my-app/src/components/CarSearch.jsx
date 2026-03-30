import { useState } from "react";
import styles from "./CarSearch.module.css";

const CarSearch = ({ onSearch }) => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [rentalDate, setRentalDate] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const searchValues = {
      pickupLocation: pickupLocation.trim(),
      rentalDate,
    };

    if (onSearch) {
      onSearch(searchValues);
    }
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Tìm kiếm xe</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Điểm đón</span>
          <input
            type="text"
            className={styles.input}
            value={pickupLocation}
            onChange={(event) => setPickupLocation(event.target.value)}
            placeholder="Nhập điểm đón"
            required
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Ngày thuê</span>
          <input
            type="date"
            className={styles.input}
            value={rentalDate}
            onChange={(event) => setRentalDate(event.target.value)}
            required
          />
        </label>

        <button type="submit" className={styles.button}>
          Tìm kiếm
        </button>
      </form>
    </div>
  );
};

export default CarSearch;
