import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function CreateRoute(){
    const location = useLocation()
    const playerName = location.state?.playerName
    const [selectedFile, setSelectedFile] = useState(null)

    const matchCode = 12345

    const navigate = useNavigate()

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0])
    }

    const handleSubmit = () => {
            navigate('/login', { state: { matchCode, playerName, selectedFile }})
    }
    
    
    return(
        <div>
            <h1>Upload Content to Create Quiz Questions</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                <label>Select a document:</label>
                <input 
                    type="file" 
                    name="document" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                />
                <br />
                <input type="submit" value="Upload" />
            </form>
        </div>
    )
}

export default CreateRoute