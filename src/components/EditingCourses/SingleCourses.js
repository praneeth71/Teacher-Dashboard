import { useState, useEffect, useRef } from "react";
import axios from "../axios/axios";
import months from "../months/months";
import { IoCloseOutline } from "react-icons/io5";
import { MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const SingleCourses = (props) => {
  const { id, title, dueDate, isComplete, tasks, setTasks } = props;
  const [isCompleted, setIsCompleted] = useState(isComplete);
  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDate, setEditDate] = useState(dueDate);
  const inputRef = useRef(null);

  const updateTask = async () => {
    setShowEdit(!showEdit);
    try {
      const editedTask = {
        id,
        title: editTitle,
        dueDate: editDate,
        isComplete,
        user: 115,
      };
      setTasks(
        tasks.map((task) => {
          if (task.id === id) return editedTask;
          else return task;
        })
      );
      await axios.put(` /api/teacher/editCourse/7f68a129-b44a-4c00-a2a6-cfa8fc9aa27e/${id}`, editedTask);
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteTask = async () => {
    try {
      const deletedTasks = tasks.filter((task) => task.id !== id);
      setTasks(deletedTasks);
      await axios.delete(`/api/teacher/editCourse/7f68a129-b44a-4c00-a2a6-cfa8fc9aa27e/${id}`);
    } catch (err) {
      console.log(err.message);
    }
  };

  const completeTodo = async () => {
    setIsCompleted(!isCompleted);
    try {
      await axios.put(` /api/teacher/editCourse/7f68a129-b44a-4c00-a2a6-cfa8fc9aa27e/${id}`, {
        id,
        title,
        dueDate,
        isComplete: !isCompleted,
        user: 115,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (showEdit) inputRef.current.focus();
    // else inputRef.current.blur();
  }, [showEdit]);

  return (
    <div className="task-component">
      <div className="Task">
        <button className="check-btn" onClick={completeTodo}>
          {isCompleted ? <MdCheckCircle /> : <MdRadioButtonUnchecked />}
        </button>
        <div className="task-title">
          <h3 style={{ textDecoration: isCompleted ? "line-through" : "none" }}>
            {title}
          </h3>
          <p>
            Due Date: {dueDate.split("-")[2]}{" "}
            {dueDate.split("-")[1] < 10
              ? months[dueDate.split("-")[1].split("")[1]]
              : months[dueDate.split("-")[1]]}{" "}
            {dueDate.split("-")[0]}
          </p>
        </div>
        <button onClick={() => setShowEdit(!showEdit)} className="edit--button">
          <EditIcon />
        </button>
        <button onClick={deleteTask} className="delete--button">
          <DeleteOutlineIcon />
        </button>
      </div>

      {showEdit && (
        <div className="edit-task">
          <form className="edit-task-form" onSubmit={updateTask}>
            <input
              type="text"
              placeholder="Add New Task"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              ref={inputRef}
            />
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />
            <button type="submit">save</button>
            <IoCloseOutline onClick={(e) => setShowEdit(!showEdit)} />
          </form>
        </div>
      )}
    </div>
  );
};

export default SingleCourses;
