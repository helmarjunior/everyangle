import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import {
    ListGroup,
    ListGroupItem,
    ButtonGroup,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Label,
    Form,
    FormGroup,
    Col,
} from "reactstrap";
import {
    getRequest,
    putRequest,
    postRequest,
    deleteRequest,
} from "../helpers/HttpRequests";
import { toast } from "react-toastify";

const Categories = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [currentItem, setCurrentItem] = useState({});
    const [modal, setModal] = useState(false);

    const loadCategories = () => {
        const cbFunction = (cbData, response) => {
            setCategories(response.data);
        };
        getRequest("/category", null, cbFunction);
    };

    const deleteItem = (item) => {
        confirmAlert({
            title: "Confirm to submit",
            message: "Are you sure to do this.",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        const cbFunction = (cbData, response) => {
                            loadCategories();
                            if (response !== null) {
                                toast.success("deleted successfully.", {
                                    position: toast.POSITION.TOP_RIGHT,
                                });
                            }
                        };
                        deleteRequest(`/category/${item.id}`, null, cbFunction);
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const toggleModal = (item) => {
        setModal(!modal);
    };

    const setValue = (key, value) => {
        setCurrentItem((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const saveForm = () => {
        const params = {
            name: currentItem.name,
            description: currentItem.description,
        };
        const cbFunction = (cbData, response) => {
            if (response !== null) {
                toast.success("saved successfully.", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
            setIsLoading(false);
            setCurrentItem({});
            loadCategories();
            toggleModal();
        };

        setIsLoading(true);
        if (currentItem.id > 0) {
            putRequest(`/category/${currentItem.id}`, params, cbFunction);
        } else {
            postRequest("/category", params, cbFunction);
        }
    };

    return (
        <>
            <Button
                color="success"
                size="sm"
                className="mb-1"
                onClick={() => {
                    setCurrentItem({});
                    toggleModal();
                }}
            >
                New Category
            </Button>
            <ListGroup className="categories-list">
                <ListGroupItem className="justify-content-between text-left">
                    <span onClick={() => props.setCategory(0)}>All</span>
                    <ButtonGroup className="float-right"></ButtonGroup>
                </ListGroupItem>
                {categories.map((e, key) => {
                    return (
                        <ListGroupItem
                            key={key}
                            className="justify-content-between text-left"
                        >
                            <span onClick={() => props.setCategory(e.id)}>
                                {e.name}
                            </span>{" "}
                            <ButtonGroup className="float-right">
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => {
                                        setCurrentItem(e);
                                        toggleModal();
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    color="secondary"
                                    size="sm"
                                    onClick={() => deleteItem(e)}
                                >
                                    X
                                </Button>
                            </ButtonGroup>
                        </ListGroupItem>
                    );
                })}
            </ListGroup>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Category</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label sm={3}>Name</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    name="name"
                                    value={currentItem.name || ""}
                                    onChange={(event) =>
                                        setValue(
                                            event.target.name,
                                            event.target.value
                                        )
                                    }
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={3}>Description</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="description"
                                    value={currentItem.description || ""}
                                    placeholder="Description"
                                    onChange={(event) =>
                                        setValue(
                                            event.target.name,
                                            event.target.value
                                        )
                                    }
                                />
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        disabled={isLoading}
                        onClick={saveForm}
                    >
                        {isLoading ? "Loading..." : "Save"}
                    </Button>{" "}
                    <Button color="secondary" onClick={toggleModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default Categories;
