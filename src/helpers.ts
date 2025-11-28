export function convertToReadableDate(dateString: string) {
  const [month, year] = dateString.split('/');
  const isoDateString = `${year}-${month}-01`;

  const date = new Date(isoDateString);

  const options = { year: 'numeric', month: 'long' };

  return date.toLocaleDateString('en-US', options);
}