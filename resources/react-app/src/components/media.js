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

const Media = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [medias, setMedias] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentItem, setCurrentItem] = useState({});
    const [modal, setModal] = useState(false);

    useEffect(() => {
        loadMedias();
    }, [props.category]);

    const loadMedias = () => {
        const cbFunction = (cbData, response) => {
            setMedias(response.data);
        };

        const endpoint =
            props.category > 0 ? `/media?category=${props.category}` : "/media";

        getRequest(endpoint, null, cbFunction);
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
                            loadMedias();
                            if (response !== null) {
                                toast.success("deleted successfully.", {
                                    position: toast.POSITION.TOP_RIGHT,
                                });
                            }
                        };
                        deleteRequest(`/media/${item.id}`, null, cbFunction);
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    };

    const toggleModal = (item) => {
        setModal(!modal);
    };

    const setValue = (key, value) => {
        setCurrentItem((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const loadCategories = () => {
        const cbFunction = (cbData, response) => {
            if (response !== null) {
                setCategories(response.data);
                setValue("category", response.data[0].id);
            }
        };
        getRequest("/category", null, cbFunction);
    };

    const saveForm = async () => {
        /* sanitize */
        if (!currentItem.files) {
            return;
        }

        const total = currentItem.files.length;
        var total_cb_received = 0;
        for (let i = 0; i < total; i++) {
            let formData = new FormData();
            formData.append("category_id", currentItem.category);
            formData.append("files[]", currentItem.files[i]);

            var cbFunction = (cbData, response) => {
                total_cb_received += 1;

                if (total_cb_received == total) {
                    setIsLoading(false);
                    setCurrentItem({});
                    loadMedias();
                    toggleModal();
                    toast.info("Files Processed.", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                }
            };

            setIsLoading(true);
            postRequest("/media", formData, cbFunction, null, true);
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
                    loadCategories();
                    toggleModal();
                }}
            >
                Upload Media
            </Button>
            <ListGroup className="media-list">
                {medias.map((e, key) => {
                    return (
                        <ListGroupItem
                            key={key}
                            className="justify-content-between text-left"
                        >
                            <span onClick={() => props.setMedia(e)}>
                                {e.original_file_name}
                            </span>{" "}
                            <ButtonGroup className="float-right">
                                <Button
                                    color="info"
                                    size="sm"
                                    onClick={() => {
                                        props.setMedia(e)
                                    }}
                                >
                                    Play
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
                <ModalHeader toggle={toggleModal}>New Media</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label sm={3}>Category</Label>
                            <Col sm={9}>
                                <Input
                                    type="select"
                                    name="category"
                                    onChange={(event) =>
                                        setValue(
                                            event.target.name,
                                            event.target.value
                                        )
                                    }
                                >
                                    {categories.map((e, key) => {
                                        return (
                                            <option key={key} value={e.id}>
                                                {e.name}
                                            </option>
                                        );
                                    })}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={3}>Description</Label>
                            <Col sm={9}>
                                <Input
                                    type="file"
                                    multiple
                                    name="files"
                                    accept=".png, .jpeg, ,.mp3, .wav"
                                    className="multiple-upload"
                                    onChange={(event) =>
                                        setValue(
                                            event.target.name,
                                            event.target.files
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

export default Media;
