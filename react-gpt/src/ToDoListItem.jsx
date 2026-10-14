import { useState } from "react";

function ToDoListItem({toDoInfo, handleCheck, handleEdit, handleDelete}) {

    const [editMode, setEditMode] = useState(false);
    const [tempTask, setTempTask] = useState('');

    const handleCheckboxChange = () => {
        handleCheck(toDoInfo.id);
    }

    const handleEditButton = () => {
        if (editMode) {
            handleEdit(toDoInfo.id, tempTask);
            setEditMode(false);
            setTempTask('');
        } else {
            setEditMode(true);
            setTempTask(toDoInfo.task);
        }
    }

    const handleDeleteButton = () => {
        handleDelete(toDoInfo.id);
    }

    const handleTaskValueChange = (event) => {
        setTempTask(event.target.value)
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();

        handleEditButton();
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

                {!editMode && toDoInfo.completed && (
                    <input 
                        className="m-auto border-0 text-decoration-line-through form-control-plaintext px-4 fw-bold"
                        type="text"
                        value={toDoInfo.task}
                        disabled/>
                )}

                {!editMode &&!toDoInfo.completed && (
                    <input
                        className="m-auto border-0 form-control-plaintext px-4 fw-bold"
                        type="text"
                        value={toDoInfo.task}
                        disabled />
                )}

                {editMode && (
                    <input
                        className="m-auto form-control px-4 fw-bold"
                        type="text"
                        value={tempTask}
                        onChange={ handleTaskValueChange }/>
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