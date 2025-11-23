export class DateValues {
	valueAfter?: string;
	valueBefore?: string;

	constructor(
		valueAfter?: string | undefined,
		valueBefore?: string | undefined,
	) {
		this.valueAfter = valueAfter;
		this.valueBefore = valueBefore;
	}
}

export class OptionDate {
	name: string;
	id: string;
	date: DateValues;

	constructor(
		name: string,
		id: string,
		date: DateValues
	) {
		this.name = name;
		this.id = id;
		this.date = date;
	}
}
