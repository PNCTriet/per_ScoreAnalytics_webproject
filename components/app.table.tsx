"use client";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import CreateModal from "./create.modal";
import UpdateModal from "./update.modal";
import DeleteModal from "./delete.modal";
import { useState } from "react";
import Link from "next/link";

interface IProps {
  blogs: IBlog;
}
const AppTable = (props: IProps) => {
  const { blogs } = props;
  console.log(">>> check progs blogs :", blogs);

  const [blog, setBlog] = useState<IBlog | null>(null);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
  return (
    <>
      <div
        className="mb-3"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h3>Table</h3>
        <Button variant="secondary" onClick={() => setShowModalCreate(true)}>
          add new
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Author</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {blogs?.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>
                  <Link
                    href={`/blogs/${item.id}`}
                    className="mx-1 my-1 btn btn-success"
                  >
                    View
                  </Link>

                  <button
                    className="mx-1 my-1 btn btn-primary"
                    onClick={() => {
                      setBlog(item);
                      setShowModalUpdate(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="mx-1 my-1 btn btn-danger"
                  onClick={() => {
                    setBlog(item);
                    setShowModalDelete(true);
                  }}
                  >Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <CreateModal
        showModalCreate={showModalCreate}
        setShowModalCreate={setShowModalCreate}
      />
      <UpdateModal
        showModalUpdate={showModalUpdate}
        setShowModalUpdate={setShowModalUpdate}
        blog={blog}
        setBlog={setBlog}
      />
      <DeleteModal
        showModalDelete={showModalDelete}
        setShowModalDelete={setShowModalDelete}
        blog={blog}
        setBlog={setBlog}
      />
    </>
  );
};

export default AppTable;
