import React, { useState, useEffect } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExitToAppIcon from "@material-ui/icons/ExitToApp"; // ✅ Logout icon
import { SearchOutlined } from "@material-ui/icons";
import "./Sidebar.css";
import SidebarChat from "./SidebarChat";
import { db, auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { collection, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // search state
  const [{ user }] = useStateValue();

  // Fetch rooms from Firestore
  useEffect(() => {
    const roomsRef = collection(db, "rooms");
    const unsubscribe = onSnapshot(roomsRef, (snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return () => unsubscribe();
  }, []);

  // Sign out function
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("User signed out"))
      .catch((error) => console.error("Sign out error:", error));
  };

  // Filter rooms based on search input
  const filteredRooms = rooms.filter((room) =>
    room.data.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-user">
          <Avatar src={user?.photoURL} />
          <h4>{user?.displayName}</h4> {/* Display user name */}
        </div>
        <div className="sidebar-headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton
            onClick={handleSignOut}
            title="Sign Out"
            className="logout-btn"
          >
            <ExitToAppIcon />
          </IconButton>
        </div>
      </div>

      {/* Sidebar Search */}
      <div className="sidebar-search">
        <div className="sidebar-searchContainer">
          <SearchOutlined />
          <input
            placeholder="Search or start new chat"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sidebar Chats */}
      <div className="sidebar-chats">
        <SidebarChat addNewChat />
        {filteredRooms.map((room) => (
          <SidebarChat
            key={room.id}
            id={room.id}
            name={room.data.name}
            searchTerm={searchTerm} // pass search term for highlight
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
