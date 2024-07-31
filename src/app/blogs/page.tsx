'use client'
import AppTable from "../../../components/app.table";
import useSWR from "swr";

const BlogsPage = () => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data, error, isLoading } = useSWR(
    "http://localhost:8000/blogs",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading) return <div>is loading....</div>
  return (
    <div>
      <AppTable blogs={data} />
    </div>
  );
};

export default BlogsPage;
