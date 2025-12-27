export const isValidDate = (date: string): boolean => {
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	return regex.test(date);
};

export const formatDate = (date: Date): string => {
	return date.toISOString().split('T')[0];
};

export const getDateFromToday = (days: number): number => {
	const MILLISECONDS_IN_DAY: number = 24 * 60 * 60 * 1000;
	return Date.now() - days * MILLISECONDS_IN_DAY;
};

export const utcToLocalDate = (utcTimestamp: number | ''): Date | '' => {
	if (!utcTimestamp) return '';
	const date = new Date(utcTimestamp);
	return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
};

export const localDateToUtc = (
	localDate: Date,
	isEndOfDay: boolean = false,
): number => {
	const utcDate = new Date(
		Date.UTC(
			localDate.getFullYear(),
			localDate.getMonth(),
			localDate.getDate(),
			isEndOfDay ? 23 : 0,
			isEndOfDay ? 59 : 0,
			isEndOfDay ? 59 : 0,
			isEndOfDay ? 999 : 0,
		),
	);
	return utcDate.getTime();
};
