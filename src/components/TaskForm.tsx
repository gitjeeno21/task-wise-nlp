import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task, TaskPriority, TaskCategory, TaskStatus } from "@/types/task";
import { Plus } from "lucide-react";

interface TaskFormProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

// Simple NLP-like logic for auto-categorization and priority
function analyzeTask(title: string, description: string) {
  const text = (title + ' ' + description).toLowerCase();
  
  // Auto-assign priority
  let priority: TaskPriority = 'medium';
  if (text.includes('urgent') || text.includes('asap') || text.includes('important') || text.includes('critical')) {
    priority = 'high';
  } else if (text.includes('later') || text.includes('someday') || text.includes('maybe') || text.includes('low priority')) {
    priority = 'low';
  }
  
  // Auto-assign category
  let category: TaskCategory = 'other';
  if (text.includes('work') || text.includes('meeting') || text.includes('project') || text.includes('office')) {
    category = 'work';
  } else if (text.includes('study') || text.includes('homework') || text.includes('learn') || text.includes('course')) {
    category = 'study';
  } else if (text.includes('exercise') || text.includes('doctor') || text.includes('health') || text.includes('gym')) {
    category = 'health';
  } else if (text.includes('buy') || text.includes('shop') || text.includes('purchase') || text.includes('grocery')) {
    category = 'shopping';
  } else if (text.includes('family') || text.includes('friend') || text.includes('personal') || text.includes('home')) {
    category = 'personal';
  }
  
  return { priority, category };
}

export function TaskForm({ task, isOpen, onClose, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'pending');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [category, setCategory] = useState<TaskCategory>(task?.category || 'other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-analyze only for new tasks
    const analyzed = !task ? analyzeTask(title, description) : { priority, category };
    
    onSubmit({
      title,
      description,
      status,
      priority: analyzed.priority,
      category: analyzed.category,
    });
    
    // Reset form
    if (!task) {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setCategory('other');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your task... (AI will auto-categorize based on keywords)"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority {!task && <span className="text-xs text-muted-foreground">(Auto-assigned)</span>}</Label>
              <Select 
                value={priority} 
                onValueChange={(value) => setPriority(value as TaskPriority)}
                disabled={!task} // Only allow manual selection when editing
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category {!task && <span className="text-xs text-muted-foreground">(Auto-assigned)</span>}</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as TaskCategory)}
              disabled={!task} // Only allow manual selection when editing
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary">
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}