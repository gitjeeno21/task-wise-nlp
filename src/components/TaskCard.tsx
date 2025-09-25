import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus } from "@/types/task";
import { Clock, CheckCircle2, Play, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const statusIcons = {
  pending: Clock,
  'in-progress': Play,
  completed: CheckCircle2,
};

const statusColors = {
  pending: "border-l-muted-foreground",
  'in-progress': "border-l-warning",
  completed: "border-l-success",
};

const priorityColors = {
  high: "bg-priority-high/10 text-priority-high border-priority-high",
  medium: "bg-priority-medium/10 text-priority-medium border-priority-medium",
  low: "bg-priority-low/10 text-priority-low border-priority-low",
};

export function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const StatusIcon = statusIcons[task.status];

  return (
    <Card className={`p-4 border-l-4 ${statusColors[task.status]} bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-foreground group-hover:text-primary-glow transition-colors">
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant="outline" 
              className={priorityColors[task.priority]}
            >
              {task.priority}
            </Badge>
            <Badge variant="secondary">
              {task.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {task.status !== 'in-progress' && (
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'in-progress')}>
                Mark as In Progress
              </DropdownMenuItem>
            )}
            {task.status !== 'completed' && (
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'completed')}>
                Mark as Completed
              </DropdownMenuItem>
            )}
            {task.status !== 'pending' && (
              <DropdownMenuItem onClick={() => onStatusChange(task.id, 'pending')}>
                Mark as Pending
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onEdit(task)}>
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task.id)}
              className="text-destructive focus:text-destructive"
            >
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}