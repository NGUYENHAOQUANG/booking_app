import CarSearch from "../components/CarSearch";

const SearchPage = () => {
  const handleSearch = (values) => {
    console.log("Giá trị tìm kiếm:", values);
  };

  return (
    <div>
      <h1>Search Page</h1>
      <p>Kết quả tìm kiếm phòng.</p>
      <CarSearch onSearch={handleSearch} />
    </div>
  );
};

export default SearchPage;
