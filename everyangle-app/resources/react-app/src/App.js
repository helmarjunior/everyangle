import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import { Container, Row, Col, Jumbotron } from "reactstrap";
import React, { useEffect, useState } from "react";
import Player from "./components/player";
import Categories from "./components/categories";
import Media from "./components/media";

function App() {
    const [category, setCategory] = useState(0);
    const [media, setMedia] = useState({});
    return (
        <div className="App">
            <ToastContainer />
            <Container>
                <div></div>
                <Row>
                    <Col xs="6" sm="5" lg="5">
                        <Jumbotron>
                            <h3 className="display-3">Media Library</h3>
                            <p className="lead">
                                Curate your own media libraries.
                            </p>
                        </Jumbotron>
                    </Col>
                    <Col xs="6" sm="6" lg="6">
                        <Player media={media} />
                    </Col>
                </Row>
                <Row>
                    <Col xs="6" sm="4" lg="4">
                        <h3>Categories</h3>
                        <Categories
                            setCategory={(id) => {
                                setCategory(id);
                                setMedia({});
                            }}
                        />
                    </Col>
                    <Col xs="6" sm="8" lg="8">
                        <h3>Media</h3>
                        <Media
                            category={category}
                            setMedia={(media) => {
                                setMedia(media);
                            }}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default App;
