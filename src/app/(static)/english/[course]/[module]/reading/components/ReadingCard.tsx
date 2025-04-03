
interface ReadingCardProps {
    number: number;
    question: string;

}
const ReadingCard = ({number, question}: ReadingCardProps) => {
    return (
        <div>
            {number}
            {question}
        </div>
    )
}

export default ReadingCard;