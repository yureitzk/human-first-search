export const isValidDate = (date: string): boolean => {
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	return regex.test(date);
};

export const formatDate = (date: Date): string => {
	return date.toISOString().split('T')[0];
};

