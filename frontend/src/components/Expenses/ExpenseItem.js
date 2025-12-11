import React from 'react';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
	const [isSmallScreen, setIsSmallScreen] = React.useState(window.innerWidth < 480);

	React.useEffect(() => {
		const handleResize = () => setIsSmallScreen(window.innerWidth < 480);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const date = expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : '';

	const containerStyle = {
		background: '#fff',
		borderRadius: '12px',
		padding: '16px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
		flexDirection: isSmallScreen ? 'column' : 'row',
		gap: isSmallScreen ? '16px' : '0',
	};

	return (
		<div style={containerStyle}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
				<div style={{
					width: 56,
					height: 56,
					borderRadius: 12,
					background: expense.category?.color || '#e5e7eb',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#fff',
					fontWeight: 700
				}}>
					{expense.title?.charAt(0)?.toUpperCase() || 'E'}
				</div>

				<div style={{ minWidth: 0 }}>
					<div style={{ fontSize: 16, fontWeight: 700, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{expense.title}</div>
					<div style={{ fontSize: 13, color: '#666', marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{expense.description || ''}</div>
					<div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>{expense.category?.name} • {date}</div>
				</div>
			</div>

			<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
				<div style={{ fontSize: 18, fontWeight: 800, color: '#667eea' }}>Rs{(Number(expense.amount) || 0).toFixed(2)}</div>
				<button onClick={onEdit} aria-label="Edit expense" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}>Edit</button>
				<button onClick={onDelete} aria-label="Delete expense" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}>Delete</button>
			</div>
		</div>
	);
};

export default ExpenseItem;
