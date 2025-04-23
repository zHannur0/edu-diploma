const RenderFeedbackWithHighlight = ({ htmlString }: { htmlString: string | null }) => {
    if (!htmlString) return null;

    const parts = htmlString.split(/<red>(.*?)<\/red>/g);

    return (
        <>
            {parts.map((part, index) => {
                if (index % 2 === 1) {
                    return <span key={index} className="text-red-600 font-semibold">{part}</span>;
                }
                else {
                    return <span key={index} dangerouslySetInnerHTML={{ __html: part }}></span>;
                }
            })}
        </>
    );
};

export default RenderFeedbackWithHighlight;