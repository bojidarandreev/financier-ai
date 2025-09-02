import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const itemizeReceipt = async (receiptText: string) => {
  const { data } = await axios.post('/api/ai/receipt-itemize', { receiptText });
  return data;
};

const AddTransactionForm = () => {
  const [receiptText, setReceiptText] = useState('');
  const queryClient = useQueryClient();

  const { mutate, data: itemizedData, isPending } = useMutation({
    mutationFn: itemizeReceipt,
    onSuccess: () => {
      // In a real app, you'd use this data to pre-fill a more complex form
      // For now, we'll just show the items.
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const handleItemize = () => {
    mutate(receiptText);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction with AI</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Paste raw text from a receipt here..."
            value={receiptText}
            onChange={(e) => setReceiptText(e.target.value)}
            rows={10}
          />
          <Button onClick={handleItemize} disabled={isPending || !receiptText}>
            {isPending ? 'Itemizing...' : 'Itemize with AI'}
          </Button>

          {itemizedData && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Suggested Items:</h3>
              <pre className="p-2 bg-muted rounded-md text-sm">
                {JSON.stringify(itemizedData.items, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
