import { useState } from "react";

function ToDoListItem({toDoInfo, onCheck, onEdit, onDelete}) {

    const [editMode, setEditMode] = useState(false);
    const [tempTask, setTempTask] = useState('');

    const handleCheckboxChange = () => {
        onCheck(toDoInfo.id);
    }

    const handleEditButton = () => {
        if (editMode) {

            const updatedTask = tempTask.trim();

            if (!updatedTask) {
                setEditMode(false);
                setTempTask("");
                return;
            }

            onEdit(toDoInfo.id, updatedTask);
            setEditMode(false);
            setTempTask('');
        } else {
            setEditMode(true);
            setTempTask(currentValue => toDoInfo.task);
        }
    }

    const handleDeleteButton = () => {
        onDelete(toDoInfo.id);
    }

    const handleTaskValueChange = (event) => {
        setTempTask(currentValue => event.target.value)
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (!editMode) {
            return;
        }

        const updatedTask = tempTask.trim();

        if (!updatedTask) {
            setEditMode(false);
            setTempTask("");
            return;
        }

        onEdit(toDoInfo.id, updatedTask);
        setEditMode(false);
        setTempTask('');
    }

    return (
        <div
            className="todolist-item border-bottom p-2">
            <form
                className="d-flex justify-content-between align-items-center"
                onSubmit={ handleFormSubmit }>
                <input
                    type="checkbox"
                    onChange={ handleCheckboxChange }
                    checked={toDoInfo.completed}
                    className="m-2">
                </input>

                {!editMode && (
                    <span
                        className={`m-auto border-0 px-4 fw-bold ${toDoInfo.completed ? "text-decoration-line-through" : ""}`}>
                        { toDoInfo.task }
                    </span>
                )}

                {editMode && (
                    <input
                        className="m-auto form-control px-4 fw-bold"
                        type="text"
                        value={tempTask}
                        onChange={ handleTaskValueChange }
                        required/>
                )}

                <button 
                    type="button"
                    className='btn p-0'
                    onClick={ handleEditButton }>
                    <img src="/Edit_Icon.svg" style={{ width: "24px", height: "24px" }}></img>
                </button>
                <button
                    type="button"
                    className='btn p-0'
                    onClick={ handleDeleteButton }>
                    <img src="/Cancel_Icon.jpg" style={{ width: "24px", height: "24px" }}></img>
                </button>

            </form>
            
        </div>
    )
}

export default ToDoListItem;