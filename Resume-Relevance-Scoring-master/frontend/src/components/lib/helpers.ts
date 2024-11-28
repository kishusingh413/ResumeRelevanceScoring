type GetInitialsCallback = (name: string) => string;

export const getInitials: GetInitialsCallback = (name) => {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) {
    return '';
  } else if (words.length === 1) {
    return words[0][0];
  } else {
    return `${words[0][0]}${words[words.length - 1][0]}`;
  }
};

export const truncateFileName = (fileName: string): string => {
  if (fileName.length <= 30) {
    return fileName;
  } else {
    const truncatedName = fileName.slice(0, 26);
    const lastChar = fileName[fileName.length - 5];
    return `${truncatedName}..${lastChar}.pdf`;
  }
};