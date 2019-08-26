import React, { useState } from "react";
import { Input, Select, Modal, Card as AntdCard } from "antd";
import { ActivityIndicator, Card, WhiteSpace, NavBar } from "antd-mobile";
import Axios from "axios";

const { Search } = Input;
const { Option } = Select;

function showErrorModal(message) {
  Modal.error({
    title: "An unknown error occured",
    content: (
      <div>
        <p> {message}</p>
      </div>
    ),
    onOk() {}
  });
}

const BACKEND_URL = "http://localhost:5000/anti-allergy-server/us-central1/app";
const SEARCH_MODE_QUERY = "QUERY";
const SEARCH_MODE_FILTER = "FILTER";
const DISPLAY_MODE_PRODUCT = "PRODUCT";
const DISPLAY_MODE_ALLERGY = "ALLERGY";
const NO_ALLERGY = "NO_ALLERGY";

function App() {
  const [searchMode, setSearchMode] = useState(SEARCH_MODE_QUERY);
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODE_PRODUCT);
  const [products, setProducts] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [searchBar, setSearchBar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentProductURL, setCurrentProductURL] = useState("");

  function handleUnknownHTTPError(error) {
    const { response } = error;
    console.error(error);
    showErrorModal(JSON.stringify(response));
    setIsLoading(false);
  }

  function renderDisplay() {
    if (displayMode === DISPLAY_MODE_PRODUCT) {
      return products.map(({ brand, title, url }) => (
        <React.Fragment key={url}>
          <Card
            onClick={async () => {
              await computeAllergy(url);
            }}
          >
            <Card.Header
              title={brand}
              extra={<span> {title} </span>}
            ></Card.Header>
          </Card>
        </React.Fragment>
      ));
    } else {
      if (allergies.length > 0 && allergies[0] === NO_ALLERGY) {
        return (
          <React.Fragment>
            <AntdCard
              style={{
                width: "80vw",
                maxWidth: 0.8 * 700,
                backgroundColor: "#ead4d7",
                color: "rgba(0,0,0,0.7)",
                margin: "auto"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <h2>No allergic ingredients found :)</h2>
              </div>
            </AntdCard>
            <h2 style={{ marginTop: 12 }}> Visit the website </h2>
            <a href={currentProductURL}> {currentProductURL} </a>
          </React.Fragment>
        );
      }
      return (
        <React.Fragment>
          <h2 style={{ marginTop: 12 }}> Allergic Ingredients</h2>
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
          <h2 style={{ marginTop: 12 }}> Visit the website </h2>
          <a href={currentProductURL}> {currentProductURL} </a>
        </React.Fragment>
      );
    }
  }

  async function queryProducts(value) {
    try {
      setIsLoading(true);
      const res = await Axios.post(`${BACKEND_URL}/search`, { input: value });
      if (res.data) {
        setProducts(res.data.products);
        setIsLoading(false);
        setDisplayMode(DISPLAY_MODE_PRODUCT);
      }
    } catch (error) {
      handleUnknownHTTPError(error);
    }
  }

  async function computeAllergy(url) {
    try {
      setIsLoading(true);
      const res = await Axios.post(`${BACKEND_URL}/compute`, { url });
      if (res.data) {
        const { allergies } = res.data;
        if (allergies.length < 1) {
          setAllergies([NO_ALLERGY]);
        } else {
          setAllergies(res.data.allergies);
        }
        setIsLoading(false);
        setDisplayMode(DISPLAY_MODE_ALLERGY);
        setCurrentProductURL(url);
      }
    } catch (error) {
      handleUnknownHTTPError(error);
    }
  }

  const selectBefore = (
    <Select
      value={searchMode}
      style={{ width: 60 }}
      onChange={value => setSearchMode(value)}
    >
      <Option value={SEARCH_MODE_QUERY}> P </Option>
      <Option value={SEARCH_MODE_FILTER}> URL </Option>
    </Select>
  );
  console.log(searchBar, "searchBar");
  return (
    <React.Fragment>
      <NavBar
        style={{ maxWidth: 700, margin: "auto" }}
        mode="dark"
        leftContent={
          products.length > 0 && displayMode === DISPLAY_MODE_ALLERGY
            ? "Back"
            : ""
        }
        onLeftClick={() => {
          setDisplayMode(DISPLAY_MODE_PRODUCT);
        }}
      >
        Anti Allergy
      </NavBar>
      <div
        style={{
          maxWidth: 700,
          margin: "0px auto",
          backgroundColor: "white",
          padding: 24
        }}
      >
        <WhiteSpace size="md" />
        <Search
          addonBefore={selectBefore}
          value={searchBar}
          onChange={e => setSearchBar(e.target.value)}
          placeholder={
            searchMode === SEARCH_MODE_QUERY
              ? "Enter a product name"
              : "Enter a url"
          }
          disabled={isLoading}
          onSearch={value => {
            if (searchMode === SEARCH_MODE_FILTER) {
              computeAllergy(value);
              setSearchBar("");
            } else if (searchMode === SEARCH_MODE_QUERY) {
              queryProducts(value);
            }
          }}
          enterButton="Search"
          size="large"
        />
        <WhiteSpace size="md" />
        {renderDisplay()}
        <ActivityIndicator toast text="Loading..." animating={isLoading} />
      </div>
    </React.Fragment>
  );
}

export default App;
