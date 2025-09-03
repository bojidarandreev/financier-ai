import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AddCategoryDialog from '@/components/AddCategoryDialog';

const fetchCategories = async () => {
  const { data } = await axios.get('/api/categories');
  return data;
};

const CategoriesPage = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <AddCategoryDialog />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Color</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.icon}</TableCell>
                <TableCell>{category.color}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CategoriesPage;
