export const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const blogs = [
                {
                    id: "bg1",
                    title: "Wht Oiling Your Hair is Cool - And Crucial",
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis consectetur nulla, autem ipsa a beatae aliquam nobis placeat. Reiciendis, itaque! Rerum molestias recusandae sit consequatur dolore repellat saepe tempora nostrum distinctio voluptas dicta corrupti tenetur, dolor, totam iste sed! Deleniti.",
                    url: "/blogs/bg1",
                    imgUrl: "/images/ayurveda-utensils.jpg"
                },
                {
                    id: "bg2",
                    title: "Inside Our Process : How We Make Our Hair Oils Safe and Naturally",
                    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis consectetur nulla, autem ipsa a beatae aliquam nobis placeat. Reiciendis, itaque! Rerum molestias recusandae sit consequatur dolore repellat saepe tempora nostrum distinctio voluptas dicta corrupti tenetur, dolor, totam iste sed! Deleniti.",
                    url: "/blogs/bg2",
                    imgUrl: "/images/oil_bottel_repat.jpg"
                },
                // {
                //     id: "bg3",
                //     title: "Blog 3",
                //     content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis consectetur nulla, autem ipsa a beatae aliquam nobis placeat. Reiciendis, itaque! Rerum molestias recusandae sit consequatur dolore repellat saepe tempora nostrum distinctio voluptas dicta corrupti tenetur, dolor, totam iste sed! Deleniti.",
                //     url: "/blogs/bg3",
                //     imgUrl: "/images/oil_bottle_black.jpg"
                // }
            ];

            const blogId = req.query.blogId;
            if (blogId) {
                const blog = blogs.find((b) => b.id === blogId);
                if (!blog) {
                    return res.status(404).json({ message: 'Blog not found' });
                }
                return res.status(200).json(blog);
            }

            res.status(200).json(blogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            res.status(500).json({ message: 'Error fetching blogs' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

export default handler;