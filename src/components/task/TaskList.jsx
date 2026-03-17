import TaskItem from "./TaskItem";
import EmptyState from "./EmptyState";

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
  if (tasks.length === 0) {
    return <EmptyState variant={variant ?? "tasks"} />;
  }
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
