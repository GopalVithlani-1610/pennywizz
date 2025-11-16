import dayjs, {ManipulateType} from 'dayjs';

class DateHelper {
  static todayDate() {
    return dayjs().toDate();
  }

  static concateYearAndMonth(year: number, month: number) {
    return Number(`${year}${this.monthAccordingToDatabase(month)}`);
  }
  static getCurrentYearAndMonth(): number {
    const todayDate = this.todayDate();
    const month = todayDate.getMonth();
    return this.concateYearAndMonth(todayDate.getFullYear(), month);
  }
  static getYearAndMonth(month: number, year: number): number {
    return this.concateYearAndMonth(year, month);
  }

  static getYearAndMonthFromDate(date: Date): number {
    const month = date.getMonth();
    return this.concateYearAndMonth(date.getFullYear(), month);
  }
  static getLastDayOfMonth(month: number, year: number): number {
    const today = dayjs(new Date(year, month, 1));
    return today.endOf('month').date();
  }
  static subtractDate(subtract: number) {
    return dayjs().subtract(subtract, 'month').toDate();
  }

  static isDateExistInCurrentMonth(month: number, year: number) {
    const monthSanitize = this.monthAccordingToDatabase(month);
    return this.getCurrentYearAndMonth() === Number(`${year}${monthSanitize}`);
  }

  static hasSameMonthAndYear(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  }

  static formatDate(date: Date, sep: '/' | '-') {
    return dayjs(date).format(`DD${sep}MM${sep}YYYY`);
  }
  static formateDateByFormat(date: Date, format: string) {
    return dayjs(date).format(format);
  }
  static getTodayDateAndTime() {
    const date = new Date();
    return `${date.getDate()} ${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
  }
  static monthAccordingToDatabase = (month: number) => {
    return month < 10 ? `0${month}` : `${month}`;
  };
  static getFormatTime(date: Date) {
    return dayjs(date).format('hh:mma');
  }

  static getMonths() {
    return [
      'Jan',
      'Feb',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'Octomber',
      'Novemeber',
      'December',
    ];
  }

  static getMonthForIdx = (idx: number) => this.getMonths()[idx];

  static getStartAndEndDateForYearMonth = (yearMonth: number) => {
    const year = parseInt(yearMonth.toString().substring(0, 4), 10);
    const month = parseInt(yearMonth.toString().substring(4), 10);
    const startDate = new Date(year, month, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month + 1, 0);
    endDate.setHours(24, 0, 0, 0);
    return [startDate, endDate];
  };

  static subtract(date: Date, no: number, unit: ManipulateType = 'd') {
    return dayjs(date).subtract(no, unit).toDate();
  }

  static getUnixTimeStampForDate = (date: Date) => date.getTime();

  static createDate(year: number, month: number, day: number) {
    return new Date(year, month, day);
  }
  static DateFormats = {
    DEFAULT: 'DD-MM-YYYY',
    UI: 'DDt[h] MMM YYYY',
  };
}

export default DateHelper;
