import React, { useState } from "react";
import { Input } from "antd";
import { ActivityIndicator, Card, WhiteSpace } from "antd-mobile";
import Axios from "axios";
const { Search } = Input;
// import { SearchBar } from "antd-mobile";
// Button, WhiteSpace, WingBlank
// import Axios from "axios";

function App() {
  const [allergies, setAllergies] = useState([]);
  const [searchBar, setSearchBar] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function computeAllergy(value) {
    try {
      setIsLoading(true);
      const res = await Axios.post(
        "https://us-central1-anti-allergy-server.cloudfunctions.net/app/compute",
        { url: value }
      );
      if (res.data) {
        setAllergies(res.data.allergies);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }
  console.log(searchBar);
  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0px auto",
        backgroundColor: "white",
        padding: 24
      }}
    >
      <Search
        value={searchBar}
        onChange={e => setSearchBar(e.target.value)}
        placeholder="Enter url"
        disabled={isLoading}
        onSearch={value => {
          setSearchBar("");
          computeAllergy(value);
        }}
        enterButton="Search"
        size="large"
      />
      <WhiteSpace size="md" />
      {allergies.map(allergy => {
        return (
          <React.Fragment key={allergy}>
            <Card>
              <Card.Body>
                <h2> {allergy} </h2>
              </Card.Body>
            </Card>
            <WhiteSpace size="md" />
          </React.Fragment>
        );
      })}
      <ActivityIndicator toast text="Loading..." animating={isLoading} />
    </div>
  );
}

export default App;
