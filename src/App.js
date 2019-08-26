import React from "react";
import { SearchBar } from "antd-mobile";
// Button, WhiteSpace, WingBlank
// import Axios from "axios";
import "./App.css";

function App() {
  // useEffect(() => {
  //   const testFetch = async () => {
  //     try {
  //       const res = await Axios.get(
  //         "https://www.skincarisma.com/products/shiseido/anessa-perfect-uv-sunscreen-aqua-booster-spf-50-pa/ingredient_list"
  //       );
  //       console.log(res, "response");
  //     } catch (error) {
  //       const { response } = error;
  //       console.log(response, "error.response");
  //     }
  //   };
  //   testFetch();
  // }, []);
  return (
    <div>
      <SearchBar placeholder="Search" />
    </div>
  );
}

export default App;
