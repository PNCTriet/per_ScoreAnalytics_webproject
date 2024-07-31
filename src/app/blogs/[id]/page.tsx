'use client'
import Card from "react-bootstrap/Card";
import useSWR from "swr";

const ViewDetailBlog = ({ params }: { params: { id: string } }) => {
  console.log(">>> check : ", params.id);
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/blogs/${params.id}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading) return <div>is loading....</div>;
  return (
    <div>
      {/* view detail blog id = {params.id} */}
      <Card>
        <Card.Header>{data?.title}</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>
              {" "}
              {data?.content}{" "}
            </p>
            <footer className="blockquote-footer">
              {data?.author} <cite title="Source Title">@RCakeStudio</cite>
            </footer>
          </blockquote>
        </Card.Body>
      </Card>
    </div>
  );
};
export default ViewDetailBlog;
