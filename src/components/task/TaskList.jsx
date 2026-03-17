import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  variant,
  deleteCandidate,
  removingIds, // ← add
  onToggleStatus,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  onUpdate,
  onRestore,
}) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          variant={variant}
          deleteCandidate={deleteCandidate}
          isRemoving={removingIds?.has(task._id)}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          onConfirmDelete={onConfirmDelete}
          onCancelDelete={onCancelDelete}
          onUpdate={onUpdate}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
}

export default TaskList;
