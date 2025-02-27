import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import axios from 'axios'
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
const App = () => {
  const [data, setData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [currentId, setCurrentId] = useState(null);
  // Add
  const [openAdd, setOpenAdd] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState(null);
  // getbyid
  const [dataId, setDataId] = useState({});
  const [openID, setOpenID] = useState(false);
  // IMG
  const Api = 'https://to-dos-api.softclub.tj/api/to-dos'
  const handleDeleteImg = async(id) => {
    await axios.delete(`${Api}/images/${id}`); 
    GetData();
  }
  const GetData = async () => {
    try {
      const response = await fetch("https://to-dos-api.softclub.tj/api/to-dos");
      const res = await response.json();
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteUser = async (id) => {
    try {
      await fetch(`https://to-dos-api.softclub.tj/api/to-dos?id=${id}`, {
        method: "DELETE",
      });
      GetData();
    } catch (error) {
      console.error(error);
    }
  };
  const editIt = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://to-dos-api.softclub.tj/api/to-dos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentId,
          name: editName,
          description: editDescription,
        }),
      });
      setOpenEdit(false);
      GetData();
    } catch (error) {
      console.error(error);
    }
  };
  const EditClick = (id, name, description) => {
    setCurrentId(id);
    setEditName(name);
    setEditDescription(description);
    setOpenEdit(true);
  };
  const Saving = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc);
    for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
    }
    try {
      const response = await fetch(
        "https://to-dos-api.softclub.tj/api/to-dos",
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await response.json();
      GetData();
      setOpenAdd(false);
      setName("");
      setDesc("");
      setImages(null);
    } catch (error) {
      console.error(error);
    }
  };
  const getById = async (id) => {
    try {
      const response = await fetch(
        `https://to-dos-api.softclub.tj/api/to-dos/${id}`,
        { method: "GET" }
      );
      const res = await response.json();
      setDataId(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    GetData();
    getById(currentId); 
  }, [currentId]); 
  const handleViewClick = (id) => {
    setCurrentId(id); // Set current ID
    setOpenID(true); // Open the modal
  };

  function handleClick() {
    if (localStorage.theme === "dark" || !("theme" in localStorage)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
    } else {
      localStorage.theme = "dark";
    }
  }
  const CheckboxChange = async (id, isCompleted) => {
    try {
      const response = await fetch(
        `https://to-dos-api.softclub.tj/completed?id=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isCompleted: !isCompleted,
          }),
        }
      );
      GetData();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className=" bg-white dark:bg-black py-10 ">
      <h1 className="font-bold text-3xl text-gray-900 dark:text-white m-auto text-center">
        Homework
      </h1>
      <div className="flex justify-center gap-5 m-auto text-center my-10">
        <button
          className="bg-green-700 text-white p-2 rounded-md font-bold"
          onClick={handleClick}
        >
          Dark Mode <NightlightOutlinedIcon/>
        </button>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-green-700 text-white font-bold  p-2 rounded-md">
          Add+
        </button>
      </div>
      <div className="flex justify-center flex-wrap gap-10 px-6">
        {data.map((el) => (
          <div
            key={el.id}
            className="w-[300px] rounded-2xl shadow-lg hover:shadow-2xl transition-all bg-white-100 dark:bg-[#3a3434e0] mb-8">
            <div className="p-6 flex flex-col items-start">
              <h2 className="font-bold text-xl text-gray-900 dark:text-amber-50">
                {el.name.length > 25 ? el.name.slice(0, 25) + "..." : el.name}
              </h2>
              <p className="text-gray-600 text-base dark:text-gray-300">
                {el.description.length > 28
                  ? el.description.slice(0, 28) + "..."
                  : el.description}
              </p>
              <button
                className={`text-white px-2 py-1 rounded text-[12px] ml-auto 
                ${el.isCompleted ? "bg-green-900" : "bg-red-700"}`}>
                {el.isCompleted ? "Active" : "Inactive"}
              </button>
             
              <div className="relative mt-4">
                <div className="flex flex-wrap justify-center">
                  <div className={`flex flex-wrap gap-2`}>
                    {el.images.map((img) => (
                      <div
                        key={img.id}
                        className={`relative p-0.5 ${el.images.length > 1 ? 'w-[122px]' : 'w-full'}`}>
                        <img className="w-full h-[200px] object-cover rounded-lg"
                          src={`https://to-dos-api.softclub.tj/images/${img.imageName}`}/>
                        <button
                          className="absolute top-2 right-2 p-1"
                          onClick={() => handleDeleteImg(img.id)} >
                          <ClearIcon className="text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="btns flex gap-3 mt-3">
                <button
                  onClick={() =>
                    EditClick(el.id, el.name, el.description)
                  }
                >
                  <BorderColorOutlinedIcon className="text-green-900 hover:text-green-600" />
                </button>
                <button onClick={() => handleViewClick(el.id)}>
                  <VisibilityOutlinedIcon className="text-green-900 hover:text-green-600" />
                </button>
                <button onClick={() => deleteUser(el.id)}>
                  <DeleteOutlinedIcon className="text-green-900 hover:text-green-600" />
                </button>
                <input
                  type="checkbox"
                  className="w-[15px] h-[22px] text-green-900 accent-green-900 cursor-pointer mt-1 ml-28"
                  checked={el.isCompleted}
                  onChange={() => CheckboxChange(el.id, el.isCompleted)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      <Modal open={openEdit}>
        <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center w-[400px] h-[300px] text-black bg-white m-auto rounded-2xl">
          <h2 className="font-bold mb-3 text-[20px] text-left">Editing</h2>
          <form onSubmit={editIt} className="flex flex-col">
            <input
              type="text"
              placeholder="Edit name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="mb-3 p-2 border border-gray-400 rounded-md outline-none"
            />
            <input
              placeholder="Edit description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="mb-3 p-2 border border-gray-400 rounded-md outline-none"
            />
            <div className="flex justify-center gap-2">
              <button
                type="submit"
                className="bg-green-900 font-bold text-white px-4 rounded-md hover:bg-green-800"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setOpenEdit(false)}
                className="bg-green-900 font-bold text-white p-2 rounded-md hover:bg-green-800"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {/* Modal Add*/}
      <Modal open={openAdd}>
        <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center w-[400px] h-[300px] text-black bg-white m-auto rounded-2xl">
          <h2 className="font-bold mb-3 text-[20px] text-left">Add</h2>
          <form onSubmit={Saving} className="flex flex-col">
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-3 p-2 border border-gray-400 rounded-md outline-none"
            />
            <input
              placeholder="Enter description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="mb-3 p-2 border border-gray-400 rounded-md outline-none"
            />
            <input
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
              className="mb-3 p-2 border rounded-md "
            />
            <div className="flex justify-center gap-2">
              <button
                onSubmit={Saving}
                type="submit"
                className="bg-green-900 font-bold text-white px-4 rounded-md hover:bg-green-800">
                Save
              </button>
              <button
                type="button"
                onClick={() => setOpenAdd(false)}
                className="bg-green-900 font-bold text-white p-2 rounded-md hover:bg-green-800"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {/* Show */}
      <Modal open={openID}>
        <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-start m-auto w-[520px] h-[470px] bg-white shadow-lg rounded-2xl p-6">
          <div className="flex items-start gap-4 text-xl w-full mt-5">
            <span className="font-bold text-black">Name:</span>
            <h3 className="font-semibold text-gray-800">{dataId.name}</h3>
          </div>
          <div className="flex items-start gap-4 text-xl w-full mt-2">
            <span className="font-bold text-black">Description:</span>
            <h3 className="font-semibold text-gray-800">
              {dataId.description}
            </h3>
          </div>
          <div className="flex items-start gap-4 text-xl w-full">
            <span className="font-bold text-black">Id:</span>
            <p className="text-gray-800">{dataId.id}</p>
          </div>
          <div className="mt-4">
          <span className="font-bold text-black">Images:</span>
          <div className="flex flex-wrap gap-2">
            {(dataId.images || []).slice(0, 3).map((img, index) => (
              <img
                key={index}
                className="w-[200px] h-[100px] object-cover"
                src={`https://to-dos-api.softclub.tj/images/${img.imageName}`}
                alt={`Image ${index + 1}`}
              />
            ))}
          </div>
        </div>



          <button
            onClick={() => setOpenID(false)}
            className="mt-4 bg-green-900 font-bold text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
