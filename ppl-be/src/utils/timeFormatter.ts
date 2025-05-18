export const getFormattedTime = (isoString: string | number | Date) => {
  const date = new Date(isoString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const formattedHour = ((hours + 11) % 12 + 1); // Convert 0–23 to 1–12
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedMinute = minutes.toString().padStart(2, '0');

  return `${formattedHour}:${formattedMinute} ${ampm}`;
};