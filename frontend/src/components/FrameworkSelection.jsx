import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Image5 from "../Images/Image5.png";
import Image9 from "../Images/Image9.jpg";
import Navbar from "./Navbar";

function FrameworkSelection() {
    const [availableFrameworks, setAvailableFrameworks] = useState([]);
    const [newFolderName, setNewFolderName] = useState("");
    const [selectedFramework, setSelectedFramework] = useState("");
    const selectedWorkspaceReady = useRef(false);
    const [workspaceFolders, setWorkspaceFolders] = useState([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState("");
    const [sessionName, setSessionName] = useState("");
    const [meetingId, setMeetingId] = useState("");
    const [workspaceCreated, setWorkspaceCreated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

   useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/me", { withCredentials: true });
        setCurrentUser(res.data.username);
      } catch (error) {
        setCurrentUser(null);
        console.log("ERROR : ",error);
      }
     };
     fetchUser();
   }, []);


    const parseWorkspaceSelection = (selection) => {
      const index = selection.indexOf(",");
      if (index === -1) {
        return { folderName: selection, frameworkName: "" };
      }

      return {
        folderName: selection.slice(0, index),
        frameworkName: selection.slice(index + 1),
      };
    };

    const openFolder = () => {
      try {
        const { folderName, frameworkName } = parseWorkspaceSelection(selectedWorkspace);
        selectedWorkspaceReady.current = true;
        const initialRoomId = "1";
        navigateToEditor(frameworkName, folderName, initialRoomId);
      } catch (error) {
        console.log("Error opening workspace:", error);
      }
    };

    const deleteFolder = async () => {
      try {
        const { folderName, frameworkName } = parseWorkspaceSelection(selectedWorkspace);

        await axios.post(
          "http://localhost:5000/deletefolder",
          {
            username: currentUser,
            foldername: folderName,
            frameworkname: frameworkName,
          },
          { withCredentials: true }
        );

        fetchUserFolders();
      } catch (error) {
        console.error("Error deleting folder:", error);
      }
    };      

     const handleLogout = async ()=>{
         try{
           await axios.get('http://localhost:5000/logout',{
             withCredentials: true 
           });
           navigate("/",{ replace: true });
         }catch(error){
            console.error("Error in logout : ",error);
         }
      }

    const createFolder = async () => {
      if (!selectedWorkspaceReady.current) {
        try {
          await axios.post(
            "http://localhost:5000/newfolder",
            {
              username: currentUser,
              frameworkname: selectedFramework,
              foldername: newFolderName,
            },
            { withCredentials: true }
          );

          selectedWorkspaceReady.current = true;
          setWorkspaceCreated(true);
        } catch (error) {
          alert("Choose a different folder name or try again later.");
          console.log("Error creating folder:", error);
        }
      } else {
        console.log("Not creating a new workspace because one is already active.", selectedWorkspaceReady.current);
      }
    };

    const navigateToEditor = (framework, folderName, roomID) => {
      if (selectedWorkspaceReady.current) {
        navigate(`/${currentUser}/editor/${framework}/${folderName}/${roomID}`);
      } else {
        console.log("No folder created or folder selection invalid");
      }
    };

    const fetchFrameworks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/frameworks");
        setAvailableFrameworks(response.data);
      } catch (error) {
        console.error("Error fetching frameworks:", error);
      }
    };

    const fetchUserFolders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/userFolders/${currentUser}`);
        setWorkspaceFolders(response.data);
      } catch (error) {
        console.error("Error fetching user folders", error);
      }
    };

    useEffect(() => {
      if (currentUser) {
        fetchFrameworks();
        fetchUserFolders();
      }
    }, [currentUser, workspaceCreated]);
      

    const handleCreateRoom = async () => {
      try {
        const { folderName, frameworkName } = parseWorkspaceSelection(selectedWorkspace);

        const response = await axios.post("http://localhost:5000/create-room", {
          username: currentUser,
          roomName: sessionName,
          creatorFolder: folderName,
          creatorFramework: frameworkName,
        });

        const roomId = response.data.roomId;
        selectedWorkspaceReady.current = true;
        if (roomId) navigateToEditor(frameworkName, folderName, roomId);
      } catch (err) {
        console.error("Error creating room:", err);
      }
    };

    const handleJoinRoom = async (roomIdToJoin) => {
      try {
        if (!roomIdToJoin || !currentUser) {
          console.error("Missing room ID or current user.");
          return;
        }

        const response = await axios.post("http://localhost:5000/join-room", {
          roomId: roomIdToJoin,
          username: currentUser,
        });
        const { folderFramework, folderName } = response.data;

        selectedWorkspaceReady.current = true;
        navigateToEditor(folderFramework, folderName, roomIdToJoin);
      } catch (err) {
        console.error("Error joining room:", err);
      }
    };

    return (
        <div className="frameworkSelection">
            <div className="fsdashboard">
             <Navbar isRoomPage currentUser={currentUser} />
             <span className="logoutbtn">
                <button onClick={handleLogout}>Logout</button>
             </span>
             <div className="roomHandling">
              <div className="leftRoomContent">
                <h1>Start a room instantly and collaborate with your team.</h1>
               <div className="createRoom">
                <button onClick={handleCreateRoom} disabled={!currentUser}>
                    New Meeting
                </button>
               </div>

               <div className="joinRoom">
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                />
                <button onClick={() => handleJoinRoom(meetingId)}>Join Room</button>
               </div>
              </div>

              <div className="rightRoomContent">
                <img src={Image5} alt="Imagee5"></img>
              </div>
            </div>

            <div className="dashboard">
                <div className="folderDisplay">
                    <div className="leftFolderDisplay">
                       <img src={Image9} alt="Image9"></img>
                    </div>

                    <div className="rightFolderDisplay">
                    <div className="userFolders">
                        <select
                            onChange={(e) => setSelectedWorkspace(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Your Folder</option>
                            {workspaceFolders.map((folder) => (
                                <option key={folder} value={folder}>{folder}</option>
                            ))}
                        </select>
                        <button onClick={openFolder} id="openFolder">Open Folder</button>
                        <button onClick={deleteFolder} id="deleteFolder">Delete Folder</button>
                    </div>

                    <div className="foldercreation">
                        <input type="text" placeholder="Folder name..." autoComplete="off" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)}></input>
                        <select
                            onChange={(e) => setSelectedFramework(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Framework</option>
                            {availableFrameworks.map((fw) => (
                                <option key={fw} value={fw}>{fw}</option>
                            ))}
                        </select>
                        <button onClick={createFolder} id="createFolder">Create Folder</button>
                    </div>
                    </div>
                </div>

            </div>            
            </div>
        </div> 
    );
} 

export default FrameworkSelection;

