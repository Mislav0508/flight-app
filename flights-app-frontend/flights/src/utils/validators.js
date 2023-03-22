export const validateRequired = (value) => !!value.length;

export function validateDateTime(value) {
  const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
  const match = value.match(regex);

  if (!match) {
    return false;
  }

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  const hours = parseInt(match[4], 10);
  const minutes = parseInt(match[5], 10);
  const seconds = parseInt(match[6], 10);

  const date = new Date(year, month - 1, day, hours, minutes, seconds);

  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day &&
    date.getHours() === hours &&
    date.getMinutes() === minutes &&
    date.getSeconds() === seconds
  );
}