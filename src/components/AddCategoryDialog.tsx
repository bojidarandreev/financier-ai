import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import React from "react"

const createCategory = async (newCategory) => {
    const { data } = await axios.post('/api/categories', newCategory);
    return data;
}

const AddCategoryDialog = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newCategory = Object.fromEntries(formData.entries());
    mutation.mutate(newCategory);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Add a new category for your transactions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" name="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="icon" className="text-right">Icon</Label>
                    <Input id="icon" name="icon" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="color" className="text-right">Color</Label>
                    <Input id="color" name="color" type="color" className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit">Save changes</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCategoryDialog;
