import React, { useState } from "react";
import { Input, Select, Modal } from "antd";
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

const BACKEND_URL = "https://us-central1-anti-allergy-server.cloudfunctions.net/app";
const SEARCH_MODE_QUERY = "QUERY";
const SEARCH_MODE_FILTER = "FILTER";
const DISPLAY_MODE_PRODUCT = "PRODUCT";
const DISPLAY_MODE_ALLERGY = "ALLERGY";

function App() {
  const [searchMode, setSearchMode] = useState(SEARCH_MODE_QUERY);
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODE_PRODUCT);
  const [products, setProducts] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [searchBar, setSearchBar] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        setAllergies(res.data.allergies);
        setIsLoading(false);
        setDisplayMode(DISPLAY_MODE_ALLERGY);
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

  return (
    <React.Fragment>
      <NavBar
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
            } else if (searchMode === SEARCH_MODE_QUERY) {
              queryProducts(value);
            }
            setSearchBar("");
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
