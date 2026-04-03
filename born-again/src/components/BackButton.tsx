import {useNavigate} from "react-router-dom";

interface Props {
    to: string
}

export default function BackButton({ to }: Props) {
    const navigate = useNavigate()
    return (
        <button
            onClick={() => navigate(to)}
            className="btn btn-ghost btn-sm -ml-2"
        >
            ← Back
        </button>
    )
}
