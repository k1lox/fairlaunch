// src/components/token/TransactionList.tsx
import React from 'react';
import styled from 'styled-components';
import { TokenTransaction } from '../../types/tokens';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';

interface TransactionListProps {
  transactions: TokenTransaction[];
}

const TransactionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundLight};
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundLight};
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const AddressCell = styled(TableCell)`
  font-family: monospace;
`;

const TypeBadge = styled.span<{ type: 'buy' | 'sell' }>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ type, theme }) => 
    type === 'buy' ? `${theme.colors.success}33` : `${theme.colors.error}33`};
  color: ${({ type, theme }) => 
    type === 'buy' ? theme.colors.success : theme.colors.error};
`;

const NoTransactions = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <TransactionTable>
            <thead>
              <tr>
                <TableHeader>Type</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Address</TableHeader>
                <TableHeader>Time</TableHeader>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <TypeBadge type={tx.type}>
                      {tx.type}
                    </TypeBadge>
                  </TableCell>
                  <TableCell>${tx.price.toFixed(4)}</TableCell>
                  <TableCell>{tx.amount.toLocaleString()}</TableCell>
                  <AddressCell>{truncateAddress(tx.address)}</AddressCell>
                  <TableCell>{formatDate(tx.timestamp)}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </TransactionTable>
        ) : (
          <NoTransactions>No transactions yet</NoTransactions>
        )}
      </CardContent>
    </Card>
  );
};