import ErrorMessage from "../errorMessage/ErrorMessage"
import { Link, useNavigate} from "react-router-dom"

const Page404 = () => {
    const navigate = useNavigate();
    const back = ()=> {
        navigate(-1);
    }
    return (
        <div>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>Page doesn`t exist</p>
            <p style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px', 'cursor':'pointer'}} onClick={back} >Back to last page</p>
            <Link style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px'}} to={'/'}>Back to main page</Link>
        </div>
    )
}

export default Page404;