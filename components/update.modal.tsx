"use client";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { mutate } from "swr";


interface IProps {
  showModalUpdate: boolean;
  setShowModalUpdate: (show: boolean) => void;
  blog: IBlog | null;
  setBlog: (value: IBlog | null) => void;
}
function UpdateModal(props: IProps) {
  const { showModalUpdate, setShowModalUpdate, blog, setBlog } = props;
  const [id, setId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (blog && blog.id) {
      setId(blog.id);
      setTitle(blog.title);
      setAuthor(blog.author);
      setContent(blog.content);
    }
  }, [blog])

  const handleSubmit = () => {
    if (!title) {
        toast.error("Empty title !");
        return;
    }
    if (!author) {
        toast.error("Empty author !");
        return;
    }
    if (!content) {
        toast.error("Empty content !");
        return;
    }

    fetch(`http://localhost:8000/blogs/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
        }, 
        body: JSON.stringify({title, author, content})
    }).then(res => res.json())
    .then(res => {
        if (res) toast.warning("Update succeed !...~");
        mutate("http://localhost:8000/blogs");
        handleCloseModal();
        //console.log(">>> check data form : ", res)
    });
    
    //console.log(">>> check data form : ",title, author, content);
  }

  const handleCloseModal = () => {
    // setTitle("");
    // setAuthor("");
    // setContent(""); 
    setBlog(null);
    setShowModalUpdate(false)
  }
  return (
    <>
      <Modal
        show={showModalUpdate}
        onHide={() => handleCloseModal()}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModal()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSubmit()}>save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateModal;
