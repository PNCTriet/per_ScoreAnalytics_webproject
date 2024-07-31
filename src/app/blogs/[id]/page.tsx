const ViewDetailBlog = ({ params }: { params: { id: string } }) => {
    console.log(">>> check : ", params.id)
    return (
        <div>
            view detail blog id = {params.id}
        </div>
    )
}
export default ViewDetailBlog;