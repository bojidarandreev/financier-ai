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
import { DatePicker } from "./ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import React from "react"

const fetchAccounts = async () => {
  const { data } = await axios.get('/api/accounts');
  return data;
};

const fetchCategories = async () => {
    const { data } = await axios.get('/api/categories');
    return data;
};

const createTransaction = async (newTransaction) => {
    const { data } = await axios.post('/api/transactions', newTransaction);
    return data;
}

const AddTransactionDialog = () => {
  const queryClient = useQueryClient();
  const { data: accounts } = useQuery({ queryKey: ['accounts'], queryFn: fetchAccounts });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  
  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newTransaction = Object.fromEntries(formData.entries());
    mutation.mutate(newTransaction);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a new transaction to your account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Input id="description" name="description" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount</Label>
                    <Input id="amount" name="amount" type="number" step="0.01" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">Date</Label>
                    <DatePicker />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="accountId" className="text-right">Account</Label>
                    <Select name="accountId">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts?.map(account => <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryId" className="text-right">Category</Label>
                    <Select name="categoryId">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories?.map(category => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
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

export default AddTransactionDialog;
