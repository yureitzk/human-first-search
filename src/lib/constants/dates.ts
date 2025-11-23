import { OptionDate } from '~/lib/models/OptionDate';

export const noneDate = new OptionDate('None', 'none', {});
export const before2023Date = new OptionDate(
	'Before 1st January 2023',
	'before2023',
	{
		valueAfter: undefined,
		valueBefore: '2023-01-01',
	},
);
export const beforeNov2022Date = new OptionDate(
	'Before November 2022',
	'beforenov2022',
	{
		valueAfter: undefined,
		valueBefore: '2022-11-01',
	},
);
export const customDate = new OptionDate('Custom Range', 'custom', {
	valueAfter: '',
	valueBefore: '',
});

export const dates = [noneDate, before2023Date, beforeNov2022Date, customDate];
